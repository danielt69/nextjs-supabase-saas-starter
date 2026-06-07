import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Multi-tenant schema, mirroring the Supabase template's model but expressed in
 * Convex's document/index style (Convex has no SQL joins or row-level security,
 * so tenancy is enforced in every query/mutation via the authenticated Clerk
 * identity — see convex/_helpers.ts).
 *
 *   orgs         : a workspace / tenant
 *   orgMembers   : which Clerk user (subject) belongs to which org + role
 *   projects     : example tenant-scoped resource, scoped by orgId
 *   providerKeys : BYOK provider API keys, AES-256-GCM ciphertext, per user
 *
 * `subject` is the Clerk user id (the JWT `sub` claim, available as
 * `identity.subject` from `ctx.auth.getUserIdentity()`).
 */
export default defineSchema({
  orgs: defineTable({
    name: v.string(),
    ownerSubject: v.string(),
  }).index("byOwner", ["ownerSubject"]),

  orgMembers: defineTable({
    orgId: v.id("orgs"),
    subject: v.string(),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("member")
    ),
  })
    .index("bySubject", ["subject"])
    .index("byOrg", ["orgId"])
    .index("byOrgAndSubject", ["orgId", "subject"]),

  projects: defineTable({
    orgId: v.id("orgs"),
    ownerSubject: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
  }).index("byOrg", ["orgId"]),

  providerKeys: defineTable({
    subject: v.string(),
    provider: v.string(),
    // App-layer AES-256-GCM ciphertext (see src/lib/crypto.ts). Convex never
    // stores the plaintext key, and the ciphertext is only ever read back
    // server-side to be decrypted for an outbound LLM call.
    encryptedKey: v.string(),
  }).index("bySubjectAndProvider", ["subject", "provider"]),
});
