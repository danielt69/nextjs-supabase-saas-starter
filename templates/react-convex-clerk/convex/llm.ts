"use node";

import crypto from "node:crypto";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * BYOK lives in this Node action because encryption (AES-256-GCM) and the
 * outbound HTTP call need the Node runtime, which Convex enables with the
 * "use node" directive above. Queries/mutations run in Convex's V8 runtime and
 * cannot use `node:crypto`, so the ciphertext is read/written through the
 * internal functions in convex/providerKeys.ts.
 *
 * Output format (base64): iv(12) || authTag(16) || ciphertext
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(): Buffer {
  const raw = process.env.BYOK_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "BYOK_ENCRYPTION_KEY is not set. Add it in the Convex dashboard " +
        "(Settings > Environment Variables)."
    );
  }
  return crypto.createHash("sha256").update(raw).digest();
}

function encryptSecret(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString("base64");
}

function decryptSecret(payload: string): string {
  const key = getKey();
  const data = Buffer.from(payload, "base64");
  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + 16);
  const ciphertext = data.subarray(IV_LENGTH + 16);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");
}

async function requireSubject(ctx: {
  auth: { getUserIdentity: () => Promise<{ subject: string } | null> };
}): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated.");
  return identity.subject;
}

/**
 * Encrypt the user's provider key and store the ciphertext. The plaintext key
 * is sent from the browser over HTTPS, encrypted here, and never persisted in
 * the clear.
 */
export const saveKey = action({
  args: { apiKey: v.string() },
  handler: async (ctx, args) => {
    const subject = await requireSubject(ctx);
    const apiKey = args.apiKey.trim();
    if (!apiKey) throw new Error("API key is required.");
    const encryptedKey = encryptSecret(apiKey);
    await ctx.runMutation(internal.providerKeys.storeFor, {
      subject,
      encryptedKey,
    });
  },
});

/**
 * Decrypt the user's stored key and call an OpenAI-compatible chat completion.
 * Targets the widely-supported `/v1/chat/completions` shape so it works with
 * many providers just by changing the base URL.
 */
export const complete = action({
  args: { prompt: v.string() },
  handler: async (ctx, args): Promise<string> => {
    const subject = await requireSubject(ctx);
    const prompt = args.prompt.trim();
    if (!prompt) throw new Error("Prompt is required.");

    const encryptedKey: string | null = await ctx.runQuery(
      internal.providerKeys.getEncryptedFor,
      { subject }
    );
    if (!encryptedKey) {
      throw new Error("No provider key saved. Add one on the Settings page.");
    }

    const apiKey = decryptSecret(encryptedKey);
    const baseUrl = process.env.LLM_BASE_URL ?? "https://api.openai.com/v1";
    const model = process.env.LLM_MODEL ?? "gpt-4o-mini";

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 256,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(
        `LLM request failed (${res.status}). ${detail.slice(0, 300)}`
      );
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() ?? "(empty response)";
  },
});
