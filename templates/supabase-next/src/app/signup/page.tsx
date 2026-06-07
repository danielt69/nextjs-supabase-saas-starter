import Link from "next/link";
import { signup } from "../login/actions";
import { GoogleButton } from "@/components/GoogleButton";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6 py-16">
      <div>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-neutral-400">
          A workspace is created for you automatically.
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <GoogleButton />

      <div className="flex items-center gap-3 text-xs text-neutral-600">
        <span className="h-px flex-1 bg-neutral-800" />
        or
        <span className="h-px flex-1 bg-neutral-800" />
      </div>

      <form action={signup} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Password (min 6 chars)"
          className="rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
        <button
          type="submit"
          className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
        >
          Create account
        </button>
      </form>

      <p className="text-sm text-neutral-400">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
