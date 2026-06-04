/**
 * Centralized, build-safe env access.
 *
 * The build must succeed even when no real values are present (e.g. CI builds,
 * Vercel preview before env is wired). We therefore fall back to harmless
 * placeholders at build time and only *require* real values at runtime, when a
 * request actually needs them.
 */

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_ANON = "placeholder-anon-key";

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? PLACEHOLDER_URL;
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? PLACEHOLDER_ANON;
}

/**
 * Service-role key. Server-only. Throws if missing because any code path that
 * reaches here is explicitly performing a privileged operation at runtime.
 */
export function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. See .env.example."
    );
  }
  return key;
}

/**
 * Returns true when the app is configured with real Supabase credentials.
 * Useful for rendering a friendly "set up your env" banner instead of crashing.
 */
export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
  );
}
