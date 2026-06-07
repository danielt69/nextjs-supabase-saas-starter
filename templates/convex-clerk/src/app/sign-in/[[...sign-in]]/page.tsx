import { SignIn } from "@clerk/nextjs";

// Rendered dynamically: Clerk's UI is configured at request time from your real
// publishable key, so it is never statically prerendered during a no-secrets build.
export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <SignIn />
    </main>
  );
}
