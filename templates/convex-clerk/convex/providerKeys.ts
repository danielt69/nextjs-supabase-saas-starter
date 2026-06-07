import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireIdentity } from "./_helpers";

const PROVIDER = "openai-compatible";

/**
 * Whether the current user has a stored provider key. Safe to call from the
 * browser — it never returns the ciphertext, only a boolean.
 */
export const has = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const row = await ctx.db
      .query("providerKeys")
      .withIndex("bySubjectAndProvider", (q) =>
        q.eq("subject", identity.subject).eq("provider", PROVIDER)
      )
      .first();
    return !!row;
  },
});

/**
 * Returns the caller's own AES-256-GCM ciphertext. Intended for server-side use
 * only (called via `fetchQuery` with a Clerk token from a Server Action) so it
 * can be decrypted just before an outbound LLM call. The value is encrypted and
 * scoped to the authenticated user.
 */
export const getEncrypted = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const row = await ctx.db
      .query("providerKeys")
      .withIndex("bySubjectAndProvider", (q) =>
        q.eq("subject", identity.subject).eq("provider", PROVIDER)
      )
      .first();
    return row?.encryptedKey ?? null;
  },
});

/**
 * Store (or replace) the ciphertext for the current user. Encryption happens in
 * the Next.js server before this is called (src/lib/crypto.ts), so plaintext
 * never reaches Convex.
 */
export const save = mutation({
  args: { encryptedKey: v.string() },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const existing = await ctx.db
      .query("providerKeys")
      .withIndex("bySubjectAndProvider", (q) =>
        q.eq("subject", identity.subject).eq("provider", PROVIDER)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { encryptedKey: args.encryptedKey });
    } else {
      await ctx.db.insert("providerKeys", {
        subject: identity.subject,
        provider: PROVIDER,
        encryptedKey: args.encryptedKey,
      });
    }
  },
});

export const remove = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const existing = await ctx.db
      .query("providerKeys")
      .withIndex("bySubjectAndProvider", (q) =>
        q.eq("subject", identity.subject).eq("provider", PROVIDER)
      )
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});
