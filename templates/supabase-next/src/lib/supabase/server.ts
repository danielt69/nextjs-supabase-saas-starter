import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  getServiceRoleKey,
  getSupabaseAnonKey,
  getSupabaseUrl,
} from "@/lib/env";
import type { Database } from "@/lib/database.types";

/**
 * Server Supabase client for Server Components, Route Handlers, and Server
 * Actions. Reads/writes the session via the Next.js cookie store.
 *
 * Must be created per-request. The `setAll` try/catch is required because
 * Server Components cannot set cookies — in that case the middleware is
 * responsible for refreshing the session.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component. Safe to ignore: the middleware
          // refreshes sessions and writes cookies on the response.
        }
      },
    },
  });
}

/**
 * Privileged server client using the service-role key. Bypasses RLS — use only
 * in trusted server code and never expose it to the browser. No session cookies.
 */
export function createAdminClient() {
  return createServerClient<Database>(getSupabaseUrl(), getServiceRoleKey(), {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        /* no-op: admin client is stateless */
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
