"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { encryptSecret, decryptSecret } from "@/lib/crypto";
import { callLlm } from "@/lib/llm";

const PROVIDER = "openai-compatible";

export async function saveProviderKey(formData: FormData) {
  const apiKey = String(formData.get("apiKey") ?? "").trim();
  if (!apiKey) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Encrypt at rest before it ever touches the database.
  const encrypted_key = encryptSecret(apiKey);

  // RLS scopes this to the current user (primary key user_id + provider).
  await supabase.from("provider_keys").upsert({
    user_id: user.id,
    provider: PROVIDER,
    encrypted_key,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/settings");
}

export async function deleteProviderKey() {
  const supabase = await createClient();
  await supabase.from("provider_keys").delete().eq("provider", PROVIDER);
  revalidatePath("/settings");
}

export type DemoResult = { ok: boolean; output: string };

/**
 * BYOK demo: decrypt the user's stored key server-side and call a generic
 * OpenAI-compatible model. The plaintext key never leaves the server.
 */
export async function runLlmDemo(
  _prev: DemoResult | null,
  formData: FormData
): Promise<DemoResult> {
  const prompt = String(formData.get("prompt") ?? "").trim();
  if (!prompt) return { ok: false, output: "Enter a prompt first." };

  const supabase = await createClient();
  const { data: row } = await supabase
    .from("provider_keys")
    .select("encrypted_key")
    .eq("provider", PROVIDER)
    .single();

  if (!row) {
    return { ok: false, output: "No API key saved yet. Add one above." };
  }

  try {
    const apiKey = decryptSecret(row.encrypted_key);
    const output = await callLlm({ apiKey, prompt });
    return { ok: true, output };
  } catch (err) {
    return {
      ok: false,
      output: err instanceof Error ? err.message : "Request failed.",
    };
  }
}
