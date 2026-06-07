import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/env";
import type { Database } from "@/lib/database.types";

/**
 * Browser Supabase client for use in Client Components.
 * `createBrowserClient` is a singleton in the browser, so this is cheap to call.
 */
export function createClient() {
  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
