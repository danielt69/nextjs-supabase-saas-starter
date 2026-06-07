import { Link } from "react-router-dom";

const features = [
  {
    title: "Firebase Auth",
    body: "Google OAuth and email/password sign-in. An onAuthStateChanged context drives a <ProtectedRoute> wrapper.",
  },
  {
    title: "Firestore",
    body: "A projects collection scoped per user, with live onSnapshot updates and security rules enforcing ownership.",
  },
  {
    title: "BYOK LLM",
    body: "Users store their own provider API key, encrypted in the browser with WebCrypto (AES-256-GCM) before it hits Firestore.",
  },
  {
    title: "Type-safe SPA",
    body: "Vite + React + TypeScript, react-router-dom v7, Tailwind, and GitHub Actions CI on every push.",
  },
];

export function Landing() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-20">
      <header className="flex flex-col gap-4">
        <span className="text-sm font-medium uppercase tracking-widest text-neutral-500">
          Open-source starter
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          React + Firebase SaaS Starter
        </h1>
        <p className="text-lg text-neutral-400">
          A Vite single-page app with Firebase Authentication, multi-tenant data
          in Firestore, and a bring-your-own-key LLM demo. A clean,
          production-style foundation you can fork today.
        </p>
        <div className="mt-2 flex gap-3">
          <Link
            to="/sign-in"
            className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-neutral-800 p-5">
            <h2 className="font-semibold">{f.title}</h2>
            <p className="mt-1.5 text-sm text-neutral-400">{f.body}</p>
          </div>
        ))}
      </section>

      <footer className="text-sm text-neutral-600">
        Configure Firebase in{" "}
        <code className="rounded bg-neutral-900 px-1.5 py-0.5">.env.local</code> —
        see the README to get running in minutes.
      </footer>
    </main>
  );
}
