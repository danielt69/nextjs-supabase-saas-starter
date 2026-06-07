import { SignIn } from "@clerk/clerk-react";

export function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" />
    </main>
  );
}
