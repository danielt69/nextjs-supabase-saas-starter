# create-saas-stack

A tiny, **zero-dependency** scaffolding CLI that copies one of this repo's
[templates](../../templates) into a new directory. It is a template copier, not a
codegen engine: it copies files, rewrites the package name, and prints next steps.

## Usage

Interactive:

```bash
npm create saas-stack@latest
# or
npx create-saas-stack
```

Non-interactive (CI / scripted):

```bash
npx create-saas-stack my-app --stack convex-clerk --install
npx create-saas-stack my-app --stack supabase-next --no-install
```

## Options

| Argument | Description |
| --- | --- |
| `[dir]` | Target directory (positional). Prompted if omitted. |
| `--stack`, `-s` | `supabase-next` or `convex-clerk`. Prompted if omitted. |
| `--install`, `-i` | Run `npm install` after copying. |
| `--no-install` | Skip install. |

## What it does

1. Prompts for a stack and a target directory (unless passed as flags).
2. Copies `templates/<stack>` into the target, skipping `node_modules`, `.next`,
   `.git`, build output, and generated `tsconfig.tsbuildinfo` / `next-env.d.ts`.
3. Rewrites `package.json` `name` to a slug derived from the target directory.
4. Optionally runs `npm install`.
5. Prints stack-specific next steps (e.g. `npx convex dev` for the Convex stack).

Every template builds and type-checks with **no real secrets** present, so the
scaffolded project is runnable immediately after `npm install`.
