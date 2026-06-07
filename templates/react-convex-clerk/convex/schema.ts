import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Multi-tenant schema. Convex has no SQL joins or row-level security, so
 * tenancy is enforced in every query/mutation/action via the authenticated
 * Clerk identity (`ctx.auth.getUserIdentity()`). `subject` is the Clerk user id
 * (the JWT `sub` claim).
 *
 *   projects     : example owner-scoped resource
 *   providerKeys : BYOK provider API keys, AES-256-GCM ciphertext, per user
 */
export default defineSchema({
  projects: defineTable({
    subject: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
  }).index("bySubject", ["subject"]),

  providerKeys: defineTable({
    subject: v.string(),
    provider: v.string(),
    // App-layer AES-256-GCM ciphertext (encrypted inside the Node action in
    // convex/llm.ts). Convex never stores the plaintext key; the ciphertext is
    // only ever read back server-side to be decrypted for an outbound LLM call.
    encryptedKey: v.string(),
  }).index("bySubjectAndProvider", ["subject", "provider"]),
});
