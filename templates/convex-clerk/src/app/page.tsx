import Link from "next/link";

const features = [
  {
    title: "Clerk Auth",
    body: "Email + social sign-in via Clerk. Middleware-gated routes, server + client helpers, and a hosted account UI.",
  },
  {
    title: "Multi-tenant Convex",
    body: "orgs / orgMembers / projects in Convex. Every query and mutation enforces tenancy against the Clerk identity.",
  },
  {
    title: "BYOK LLM",
    body: "Users store their own provider API key, encrypted at rest with AES-256-GCM, then call any OpenAI-compatible model.",
  },
  {
    title: "Type-safe & reactive",
    body: "End-to-end TypeScript with generated Convex types. Live-updating queries, GitHub Actions CI on every push.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-20">
      <header className="flex flex-col gap-4">
        <span className="text-sm font-medium uppercase tracking-widest text-neutral-500">
          Open-source starter
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Next.js + Convex + Clerk SaaS Starter
        </h1>
        <p className="text-lg text-neutral-400">
          Clerk authentication, multi-tenant data on Convex with reactive
          queries, and bring-your-own-key LLM integration. A clean,
          production-style foundation you can fork today.
        </p>
        <div className="mt-2 flex gap-3">
          <Link
            href="/sign-up"
            className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            Get started
          </Link>
          <Link
            href="/sign-in"
            className="rounded-md border border-neutral-700 px-5 py-2.5 text-sm font-semibold transition hover:bg-neutral-900"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-neutral-800 p-5"
          >
            <h2 className="font-semibold">{f.title}</h2>
            <p className="mt-1.5 text-sm text-neutral-400">{f.body}</p>
          </div>
        ))}
      </section>

      <footer className="text-sm text-neutral-600">
        Configure Convex and Clerk in{" "}
        <code className="rounded bg-neutral-900 px-1.5 py-0.5">.env.local</code>{" "}
        — see the README to get running in minutes.
      </footer>
    </main>
  );
}
