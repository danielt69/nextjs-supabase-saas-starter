/**
 * Centralized, build-safe env access.
 *
 * `vite build` must succeed even when no real values are present (CI, preview
 * before env is wired). Vite inlines `import.meta.env.VITE_*` at build time; we
 * fall back to empty strings so the bundle compiles, and gate the provider tree
 * on `isConfigured()` so the running app shows a friendly notice instead of
 * crashing.
 */

export function getConvexUrl(): string {
  return import.meta.env.VITE_CONVEX_URL ?? "";
}

export function getClerkPublishableKey(): string {
  return import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "";
}

export function isConfigured(): boolean {
  return Boolean(getConvexUrl() && getClerkPublishableKey());
}
