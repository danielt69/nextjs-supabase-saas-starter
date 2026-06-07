import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Returns the authenticated Clerk identity or throws. Every function that
 * touches tenant data calls this first — it is the Convex equivalent of
 * Postgres Row Level Security: nothing is reachable without a valid identity.
 */
async function requireSubject(ctx: {
  auth: { getUserIdentity: () => Promise<{ subject: string } | null> };
}): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated.");
  return identity.subject;
}

/**
 * List the current user's projects. Reactive: client components using
 * `useQuery` re-render automatically when the data changes.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const subject = await requireSubject(ctx);
    return await ctx.db
      .query("projects")
      .withIndex("bySubject", (q) => q.eq("subject", subject))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const subject = await requireSubject(ctx);
    const name = args.name.trim();
    if (!name) throw new Error("Project name is required.");

    return await ctx.db.insert("projects", {
      subject,
      name,
      description: args.description?.trim() || undefined,
    });
  },
});

/**
 * Delete a project, but only if it belongs to the caller. This is the tenancy
 * check that RLS would do automatically in Postgres.
 */
export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const subject = await requireSubject(ctx);
    const project = await ctx.db.get(args.id);
    if (!project || project.subject !== subject) {
      throw new Error("Project not found.");
    }
    await ctx.db.delete(args.id);
  },
});
