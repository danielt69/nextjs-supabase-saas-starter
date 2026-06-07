import { useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function ProviderKeyForm() {
  const hasKey = useQuery(api.providerKeys.has);
  const saveKey = useAction(api.llm.saveKey);
  const removeKey = useMutation(api.providerKeys.remove);

  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await saveKey({ apiKey: value });
      setValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save key.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-800 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Provider API key</h2>
        <span
          className={`text-xs ${
            hasKey ? "text-green-400" : "text-neutral-500"
          }`}
        >
          {hasKey === undefined
            ? "Checking…"
            : hasKey
              ? "Key saved"
              : "No key saved"}
        </span>
      </div>
      <p className="text-sm text-neutral-400">
        Stored encrypted at rest (AES-256-GCM). The plaintext is only decrypted
        server-side, in a Convex Node action, just before an outbound LLM call.
      </p>
      <form onSubmit={onSave} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="sk-…"
          autoComplete="off"
          className="flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save"}
        </button>
      </form>
      {hasKey && (
        <button
          onClick={() => removeKey({})}
          className="self-start text-sm text-neutral-500 transition hover:text-red-400"
        >
          Remove saved key
        </button>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
