import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";

const PROVIDER = "openai-compatible";

async function requireSubject(ctx: {
  auth: { getUserIdentity: () => Promise<{ subject: string } | null> };
}): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated.");
  return identity.subject;
}

/**
 * Whether the current user has a stored provider key. Safe to call from the
 * browser — it never returns the ciphertext, only a boolean.
 */
export const has = query({
  args: {},
  handler: async (ctx) => {
    const subject = await requireSubject(ctx);
    const row = await ctx.db
      .query("providerKeys")
      .withIndex("bySubjectAndProvider", (q) =>
        q.eq("subject", subject).eq("provider", PROVIDER)
      )
      .first();
    return !!row;
  },
});

/**
 * Remove the current user's stored key.
 */
export const remove = mutation({
  args: {},
  handler: async (ctx) => {
    const subject = await requireSubject(ctx);
    const existing = await ctx.db
      .query("providerKeys")
      .withIndex("bySubjectAndProvider", (q) =>
        q.eq("subject", subject).eq("provider", PROVIDER)
      )
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});

// --- Internal: only callable from other Convex functions (the Node action) ---

/** Read the ciphertext for a user. Internal so the browser can't fetch it. */
export const getEncryptedFor = internalQuery({
  args: { subject: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("providerKeys")
      .withIndex("bySubjectAndProvider", (q) =>
        q.eq("subject", args.subject).eq("provider", PROVIDER)
      )
      .first();
    return row?.encryptedKey ?? null;
  },
});

/** Upsert the ciphertext for a user. Encryption happens in the Node action. */
export const storeFor = internalMutation({
  args: { subject: v.string(), encryptedKey: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("providerKeys")
      .withIndex("bySubjectAndProvider", (q) =>
        q.eq("subject", args.subject).eq("provider", PROVIDER)
      )
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { encryptedKey: args.encryptedKey });
    } else {
      await ctx.db.insert("providerKeys", {
        subject: args.subject,
        provider: PROVIDER,
        encryptedKey: args.encryptedKey,
      });
    }
  },
});
