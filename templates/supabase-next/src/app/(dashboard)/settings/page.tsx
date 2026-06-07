import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { LlmDemo } from "@/components/LlmDemo";
import { saveProviderKey, deleteProviderKey } from "./actions";

export default async function SettingsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-lg border border-yellow-800 bg-yellow-950/40 p-5 text-sm text-yellow-200">
        Supabase isn&apos;t configured yet. See{" "}
        <code className="rounded bg-black/40 px-1">.env.example</code>.
      </div>
    );
  }

  const supabase = await createClient();
  const { data: row } = await supabase
    .from("provider_keys")
    .select("provider, updated_at")
    .eq("provider", "openai-compatible")
    .maybeSingle();

  const hasKey = !!row;

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Bring your own LLM provider key. It is encrypted at rest with
          AES-256-GCM before being stored.
        </p>
      </section>

      <div className="rounded-lg border border-neutral-800 p-4">
        <h2 className="font-semibold">Provider API key</h2>
        <p className="mt-1 text-sm text-neutral-400">
          {hasKey
            ? "A key is saved. The plaintext is never returned to the browser."
            : "No key saved yet."}
        </p>

        <form action={saveProviderKey} className="mt-3 flex gap-2">
          <input
            name="apiKey"
            type="password"
            required
            placeholder="sk-…"
            className="flex-1 rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
          <button
            type="submit"
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            {hasKey ? "Update" : "Save"}
          </button>
        </form>

        {hasKey && (
          <form action={deleteProviderKey} className="mt-2">
            <button
              type="submit"
              className="text-sm text-neutral-500 transition hover:text-red-400"
            >
              Remove key
            </button>
          </form>
        )}
      </div>

      <LlmDemo hasKey={hasKey} />
    </div>
  );
}
