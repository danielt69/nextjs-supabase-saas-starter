"use server";

import { revalidatePath } from "next/cache";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { getConvexToken } from "@/lib/convexServer";
import { encryptSecret, decryptSecret } from "@/lib/crypto";
import { callLlm } from "@/lib/llm";

export async function saveProviderKey(formData: FormData) {
  const apiKey = String(formData.get("apiKey") ?? "").trim();
  if (!apiKey) return;

  const token = await getConvexToken();
  if (!token) return;

  // Encrypt at rest before it ever touches Convex.
  const encryptedKey = encryptSecret(apiKey);
  await fetchMutation(api.providerKeys.save, { encryptedKey }, { token });

  revalidatePath("/settings");
}

export async function deleteProviderKey() {
  const token = await getConvexToken();
  if (!token) return;
  await fetchMutation(api.providerKeys.remove, {}, { token });
  revalidatePath("/settings");
}

export type DemoResult = { ok: boolean; output: string };

/**
 * BYOK demo: read the user's stored ciphertext from Convex, decrypt it
 * server-side, and call a generic OpenAI-compatible model. The plaintext key
 * never leaves the server.
 */
export async function runLlmDemo(
  _prev: DemoResult | null,
  formData: FormData
): Promise<DemoResult> {
  const prompt = String(formData.get("prompt") ?? "").trim();
  if (!prompt) return { ok: false, output: "Enter a prompt first." };

  const token = await getConvexToken();
  if (!token) return { ok: false, output: "You must be signed in." };

  const encryptedKey = await fetchQuery(
    api.providerKeys.getEncrypted,
    {},
    { token }
  );
  if (!encryptedKey) {
    return { ok: false, output: "No API key saved yet. Add one above." };
  }

  try {
    const apiKey = decryptSecret(encryptedKey);
    const output = await callLlm({ apiKey, prompt });
    return { ok: true, output };
  } catch (err) {
    return {
      ok: false,
      output: err instanceof Error ? err.message : "Request failed.",
    };
  }
}
