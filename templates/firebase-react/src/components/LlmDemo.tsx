import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { decryptSecret } from "@/lib/crypto";
import { callLlm } from "@/lib/llm";
import { useAuth } from "@/contexts/AuthContext";

export function LlmDemo() {
  const { currentUser } = useAuth();
  const [prompt, setPrompt] = useState("Write a haiku about shipping code.");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onRun() {
    if (!currentUser) return;
    setBusy(true);
    setError(null);
    setAnswer(null);
    try {
      const snap = await getDoc(doc(db, "providerKeys", currentUser.uid));
      if (!snap.exists()) {
        throw new Error("No provider key stored. Add one in Settings first.");
      }
      const apiKey = await decryptSecret(
        currentUser.uid,
        snap.data().encryptedKey as string
      );
      const result = await callLlm({ apiKey, prompt });
      setAnswer(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "LLM request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-neutral-800 p-5">
      <h2 className="font-semibold">LLM demo</h2>
      <p className="text-sm text-neutral-500">
        Calls an OpenAI-compatible API with your stored key.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
      />
      <button
        onClick={onRun}
        disabled={busy}
        className="self-start rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
      >
        {busy ? "Running…" : "Run"}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {answer && (
        <pre className="whitespace-pre-wrap rounded-md bg-neutral-950 p-3 text-sm text-neutral-300">
          {answer}
        </pre>
      )}
    </section>
  );
}
