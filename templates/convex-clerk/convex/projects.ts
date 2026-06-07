import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getMyOrgId, requireIdentity } from "./_helpers";

/**
 * List the current user's projects, scoped to their org. Returns [] when the
 * user has no org yet (i.e. before they create their first project). Reactive:
 * client components using `useQuery` re-render automatically on change.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const orgId = await getMyOrgId(ctx, identity.subject);
    if (!orgId) return [];

    return await ctx.db
      .query("projects")
      .withIndex("byOrg", (q) => q.eq("orgId", orgId))
      .order("desc")
      .collect();
  },
});

/**
 * Create a project. Bootstraps the user's workspace (org + owner membership) on
 * first use, so a brand-new user can create immediately without a signup hook.
 */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const name = args.name.trim();
    if (!name) throw new Error("Project name is required.");

    let orgId = await getMyOrgId(ctx, identity.subject);
    if (!orgId) {
      orgId = await ctx.db.insert("orgs", {
        name: "My Workspace",
        ownerSubject: identity.subject,
      });
      await ctx.db.insert("orgMembers", {
        orgId,
        subject: identity.subject,
        role: "owner",
      });
    }

    return await ctx.db.insert("projects", {
      orgId,
      ownerSubject: identity.subject,
      name,
      description: args.description?.trim() || undefined,
    });
  },
});

/**
 * Delete a project, but only if it belongs to the caller's org. This is the
 * tenancy check that RLS would do automatically in Postgres.
 */
export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const orgId = await getMyOrgId(ctx, identity.subject);

    const project = await ctx.db.get(args.id);
    if (!project || project.orgId !== orgId) {
      throw new Error("Project not found.");
    }

    await ctx.db.delete(args.id);
  },
});
