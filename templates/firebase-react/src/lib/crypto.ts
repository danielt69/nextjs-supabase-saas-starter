/**
 * Browser-side encryption for BYOK secrets, using the WebCrypto API.
 *
 * NOTE — demo simplification: in the Supabase/T3/Convex starters the key is
 * encrypted and decrypted on a server with a server-only secret. This template
 * has no backend, so it encrypts client-side with an AES-256-GCM key derived
 * (PBKDF2) from a per-user passphrase — we pass the signed-in user's Firebase
 * uid. That keeps the plaintext key out of Firestore and scopes it to the user,
 * which is acceptable for a starter/demo. For real production secrets, proxy the
 * provider call through a Cloud Function with a server-held key.
 *
 * Output format (base64): iv(12) || ciphertext+authTag
 */

const enc = new TextEncoder();
const dec = new TextDecoder();
const SALT = enc.encode("byok-firebase-demo-salt-v1");

async function deriveKey(passphrase: string): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: SALT, iterations: 100_000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function encryptSecret(
  passphrase: string,
  plaintext: string
): Promise<string> {
  const key = await deriveKey(passphrase);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plaintext)
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return toBase64(combined);
}

export async function decryptSecret(
  passphrase: string,
  payload: string
): Promise<string> {
  const key = await deriveKey(passphrase);
  const combined = fromBase64(payload);
  const iv = new Uint8Array(combined.subarray(0, 12));
  const ciphertext = new Uint8Array(combined.subarray(12));
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return dec.decode(plaintext);
}
