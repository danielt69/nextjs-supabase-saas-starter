import crypto from "node:crypto";

/**
 * Server-side encryption helper for BYOK (bring-your-own-key) secrets.
 *
 * Uses AES-256-GCM with a key derived from BYOK_ENCRYPTION_KEY. The provider
 * API key is encrypted *before* it is written to the database, and decrypted
 * only server-side, just before an outbound LLM call.
 *
 * Output format (base64): iv(12) || authTag(16) || ciphertext
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(): Buffer {
  const raw = process.env.BYOK_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("BYOK_ENCRYPTION_KEY is not set. See .env.example.");
  }
  return crypto.createHash("sha256").update(raw).digest();
}

export function encryptSecret(plaintext: string): string {
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

export function decryptSecret(payload: string): string {
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
