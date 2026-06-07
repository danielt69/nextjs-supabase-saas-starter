import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@convex/_generated/api";

export function LlmDemo() {
  const complete = useAction(api.llm.complete);
  const [prompt, setPrompt] = useState("Write a one-line tagline for a SaaS starter kit.");
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onRun() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const text = await complete({ prompt });
      setResult(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 p-5">
      <h2 className="font-semibold">LLM demo</h2>
      <p className="text-sm text-neutral-400">
        Runs your prompt through the provider key you saved in Settings. The key
        is decrypted server-side inside a Convex action — it never returns to the
        browser.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-500"
      />
      <div>
        <button
          onClick={onRun}
          disabled={busy}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {busy ? "Running…" : "Run"}
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {result && (
        <pre className="whitespace-pre-wrap rounded-md bg-neutral-950 p-3 text-sm text-neutral-200">
          {result}
        </pre>
      )}
    </div>
  );
}
