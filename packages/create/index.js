#!/usr/bin/env node
// create-saas-stack — a tiny, zero-dependency template copier.
// It does NOT generate code: it copies one of the templates/ directories to a
// target path, rewrites the package name, and prints next steps. That's it.

import { createInterface } from "node:readline/promises";
import { stdin, stdout, argv, exit } from "node:process";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, basename } from "node:path";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

// Skip these when copying a template into the user's project.
const SKIP = new Set([
  "node_modules",
  ".next",
  ".git",
  "out",
  "build",
  ".vercel",
  ".convex",
  "tsconfig.tsbuildinfo",
  "next-env.d.ts",
]);

const STACKS = [
  {
    id: "supabase-next",
    label: "Supabase + Next.js",
    blurb: "Postgres + RLS auth, server actions, BYOK LLM. All open source.",
  },
  {
    id: "convex-clerk",
    label: "Convex + Clerk",
    blurb: "Reactive DB + hosted auth, multi-tenant by identity, BYOK LLM.",
  },
];

function templatesRoot() {
  // Published layout: templates bundled next to this script.
  const bundled = join(SCRIPT_DIR, "templates");
  if (existsSync(bundled)) return bundled;
  // Monorepo layout: packages/create/index.js -> ../../templates
  const repo = resolve(SCRIPT_DIR, "..", "..", "templates");
  if (existsSync(repo)) return repo;
  return null;
}

function toPackageName(dir) {
  // npm package names: lowercase, no spaces, limited punctuation.
  const cleaned = basename(resolve(dir))
    .toLowerCase()
    .replace(/[^a-z0-9-~._]+/g, "-")
    .replace(/^[-_.]+|[-_.]+$/g, "");
  return cleaned || "my-saas-app";
}

function rewritePackageName(projectDir, name) {
  const pkgPath = join(projectDir, "package.json");
  if (!existsSync(pkgPath)) return;
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.name = name;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
}

function copyTemplate(srcDir, destDir) {
  cpSync(srcDir, destDir, {
    recursive: true,
    filter: (src) => !SKIP.has(basename(src)),
  });
}

function parseArgs(args) {
  const out = { stack: undefined, dir: undefined, install: undefined };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--install" || a === "-i") out.install = true;
    else if (a === "--no-install") out.install = false;
    else if (a === "--stack" || a === "-s") out.stack = args[++i];
    else if (a.startsWith("--stack=")) out.stack = a.slice("--stack=".length);
    else if (!a.startsWith("-") && out.dir === undefined) out.dir = a;
  }
  return out;
}

async function main() {
  const root = templatesRoot();
  if (!root) {
    console.error(
      "Could not locate the templates directory. Run this from the repo, or reinstall the package."
    );
    exit(1);
  }

  const available = STACKS.filter((s) => existsSync(join(root, s.id)));
  if (available.length === 0) {
    console.error(`No templates found under ${root}.`);
    exit(1);
  }

  const args = parseArgs(argv.slice(2));
  const rl = createInterface({ input: stdin, output: stdout });

  console.log("\n  create-saas-stack — scaffold a SaaS starter\n");

  // 1) Stack
  let stack = available.find((s) => s.id === args.stack);
  if (!stack) {
    console.log("  Choose a stack:\n");
    available.forEach((s, i) => {
      console.log(`    ${i + 1}) ${s.label}`);
      console.log(`       ${s.blurb}\n`);
    });
    const answer = (await rl.question(`  Stack [1-${available.length}] (1): `)).trim();
    const idx = answer === "" ? 0 : Number.parseInt(answer, 10) - 1;
    stack = available[idx];
    if (!stack) {
      console.error("  Invalid selection.");
      rl.close();
      exit(1);
    }
  }

  // 2) Target directory
  let dir = args.dir;
  if (!dir) {
    dir = (await rl.question("  Project directory (./my-saas-app): ")).trim();
    if (dir === "") dir = "my-saas-app";
  }
  const destDir = resolve(dir);

  if (existsSync(destDir) && readdirSync(destDir).length > 0) {
    console.error(`\n  Target "${dir}" already exists and is not empty. Aborting.`);
    rl.close();
    exit(1);
  }

  // 3) Install?
  let install = args.install;
  if (install === undefined) {
    const a = (await rl.question("  Run npm install now? (y/N): ")).trim().toLowerCase();
    install = a === "y" || a === "yes";
  }

  rl.close();

  // Copy + rewrite
  const srcDir = join(root, stack.id);
  console.log(`\n  Creating ${stack.label} app in ${destDir} ...`);
  copyTemplate(srcDir, destDir);

  const pkgName = toPackageName(destDir);
  rewritePackageName(destDir, pkgName);

  // Install
  if (install) {
    console.log("\n  Installing dependencies (npm install) ...\n");
    const r = spawnSync("npm", ["install"], { cwd: destDir, stdio: "inherit" });
    if (r.status !== 0) {
      console.error("\n  npm install failed. You can run it manually later.");
    }
  }

  // Next steps
  const rel = dir.startsWith(".") || dir.startsWith("/") ? dir : `./${dir}`;
  console.log("\n  Done. Next steps:\n");
  console.log(`    cd ${rel}`);
  console.log("    cp .env.example .env.local   # fill in your values");
  if (!install) console.log("    npm install");
  if (stack.id === "convex-clerk") {
    console.log("    npx convex dev               # provisions Convex + writes NEXT_PUBLIC_CONVEX_URL");
  }
  console.log("    npm run dev\n");
  console.log("  See the README in your new project for full setup instructions.\n");
}

main().catch((err) => {
  console.error(err?.message ?? err);
  exit(1);
});
