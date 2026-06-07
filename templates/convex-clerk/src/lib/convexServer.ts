import "server-only";
import { auth } from "@clerk/nextjs/server";

/**
 * Returns a Clerk-issued JWT for the "convex" template, to authenticate
 * server-side Convex calls (`fetchQuery` / `fetchMutation`). Returns null when
 * the user is not signed in.
 *
 * Requires a JWT template named "convex" in the Clerk dashboard
 * (JWT Templates > New template > Convex).
 */
export async function getConvexToken(): Promise<string | null> {
  const { getToken } = await auth();
  return getToken({ template: "convex" });
}
