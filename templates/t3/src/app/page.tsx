import { redirect } from "next/navigation";
import { auth, signIn } from "@/server/auth";
import { isConfigured } from "@/lib/env";

const features = [
  {
    title: "NextAuth v5",
    body: "Auth.js with a GitHub provider and database sessions backed by Prisma. Server-action sign in/out.",
  },
  {
    title: "tRPC v11",
    body: "End-to-end type-safe API. A protectedProcedure enforces auth; routers cover projects, keys, and the LLM call.",
  },
  {
    title: "Prisma + SQLite",
    body: "Zero-config local database. Swap the datasource to PostgreSQL with a one-line change for production.",
  },
  {
    title: "BYOK LLM",
    body: "Users store their own provider API key, encrypted at rest with AES-256-GCM, decrypted only in the tRPC procedure.",
  },
];

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const configured = isConfigured();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-20">
      <header className="flex flex-col gap-4">
        <span className="text-sm font-medium uppercase tracking-widest text-neutral-500">
          Open-source starter
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          T3 SaaS Starter
        </h1>
        <p className="text-lg text-neutral-400">
          Next.js App Router with tRPC, Prisma, and NextAuth — plus a
          bring-your-own-key LLM demo. A clean, production-style foundation you
          can fork today.
        </p>
        <div className="mt-2">
          {configured ? (
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/dashboard" });
              }}
            >
              <button
                type="submit"
                className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                Get started — Sign in with GitHub
              </button>
            </form>
          ) : (
            <p className="rounded-lg border border-yellow-800 bg-yellow-950/40 p-4 text-sm text-yellow-200">
              Set <code className="rounded bg-black/40 px-1">NEXTAUTH_SECRET</code>{" "}
              and your GitHub OAuth credentials in{" "}
              <code className="rounded bg-black/40 px-1">.env</code> to enable
              sign in. See the README.
            </p>
          )}
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
        Configure your database, auth, and encryption key in{" "}
        <code className="rounded bg-neutral-900 px-1.5 py-0.5">.env</code> — see
        the README to get running in minutes.
      </footer>
    </main>
  );
}
