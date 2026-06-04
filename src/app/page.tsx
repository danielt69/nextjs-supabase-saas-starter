import Link from "next/link";

const features = [
  {
    title: "Supabase Auth (SSR)",
    body: "Email/password + Google OAuth using @supabase/ssr. Middleware refreshes the session; server components read it.",
  },
  {
    title: "Multi-tenant + RLS",
    body: "orgs / org_members / projects with Row Level Security so the anon key can only ever touch authorized rows.",
  },
  {
    title: "BYOK LLM",
    body: "Users store their own provider API key, encrypted at rest with AES-256-GCM, then call any OpenAI-compatible model.",
  },
  {
    title: "Type-safe & CI'd",
    body: "TypeScript end-to-end, Tailwind UI, GitHub Actions running typecheck + build on every push and PR.",
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
          Next.js + Supabase SaaS Starter
        </h1>
        <p className="text-lg text-neutral-400">
          Auth, multi-tenant data with Row Level Security, and bring-your-own-key
          LLM integration. A clean, production-style foundation you can fork
          today.
        </p>
        <div className="mt-2 flex gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            Get started
          </Link>
          <Link
            href="/login"
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
        Configure your Supabase project in{" "}
        <code className="rounded bg-neutral-900 px-1.5 py-0.5">.env.local</code>{" "}
        — see the README to get running in one command.
      </footer>
    </main>
  );
}
