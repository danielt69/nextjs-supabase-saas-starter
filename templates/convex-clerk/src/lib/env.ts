/**
 * Centralized, build-safe env access.
 *
 * The build must succeed even when no real values are present (CI builds, a
 * fresh clone, Vercel preview before env is wired). We fall back to harmless,
 * format-valid placeholders at build time and only *require* real values at
 * runtime, when a request actually needs them.
 */

// A syntactically-valid but non-functional Clerk publishable key. It decodes to
// "clerk.example.com$", so `<ClerkProvider>` parses it without throwing during
// a no-secrets build. Real auth only happens at runtime with your real key.
const PLACEHOLDER_CLERK_PK = "pk_test_Y2xlcmsuZXhhbXBsZS5jb20k";
const PLACEHOLDER_CONVEX_URL = "https://placeholder.convex.cloud";

export function getConvexUrl(): string {
  return process.env.NEXT_PUBLIC_CONVEX_URL ?? PLACEHOLDER_CONVEX_URL;
}

export function getClerkPublishableKey(): string {
  return (
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? PLACEHOLDER_CLERK_PK
  );
}

/**
 * True when the app is configured with real Convex + Clerk credentials. Used to
 * render a friendly "set up your env" banner instead of a broken page.
 */
export function isConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_CONVEX_URL &&
    !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  );
}
