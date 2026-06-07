import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/**
 * Returns the authenticated Clerk identity or throws. Every query/mutation that
 * touches tenant data calls this first — it is the Convex equivalent of the
 * Supabase template's Row Level Security: nothing is reachable without a valid
 * Clerk-issued identity.
 */
export async function requireIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated.");
  }
  return identity;
}

/**
 * Resolves the org the current user belongs to, or null if they have none yet.
 * The first org is created lazily on the first project insert (see projects.ts),
 * mirroring "a workspace is created automatically" from the Supabase template.
 */
export async function getMyOrgId(
  ctx: QueryCtx | MutationCtx,
  subject: string
): Promise<Id<"orgs"> | null> {
  const membership = await ctx.db
    .query("orgMembers")
    .withIndex("bySubject", (q) => q.eq("subject", subject))
    .first();
  return membership?.orgId ?? null;
}
