import { useEffect, useState, type FormEvent } from "react";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { encryptSecret } from "@/lib/crypto";
import { useAuth } from "@/contexts/AuthContext";

export function ProviderKeyForm() {
  const { currentUser } = useAuth();
  const [hasKey, setHasKey] = useState(false);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, "providerKeys", currentUser.uid)).then((snap) => {
      setHasKey(snap.exists());
    });
  }, [currentUser]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!currentUser || !value.trim()) return;
    setBusy(true);
    setStatus(null);
    try {
      const encryptedKey = await encryptSecret(currentUser.uid, value.trim());
      await setDoc(doc(db, "providerKeys", currentUser.uid), {
        userId: currentUser.uid,
        provider: "openai-compatible",
        encryptedKey,
      });
      setHasKey(true);
      setValue("");
      setStatus("Key saved and encrypted.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to save key");
    } finally {
      setBusy(false);
    }
  }

  async function onRemove() {
    if (!currentUser) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, "providerKeys", currentUser.uid));
      setHasKey(false);
      setStatus("Key removed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-neutral-800 p-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold">LLM provider key (BYOK)</h2>
        <p className="text-sm text-neutral-500">
          Stored encrypted (AES-256-GCM) in Firestore, scoped to your account.
        </p>
      </div>

      <div className="text-sm">
        Status:{" "}
        {hasKey ? (
          <span className="text-green-400">A key is stored</span>
        ) : (
          <span className="text-neutral-500">No key stored</span>
        )}
      </div>

      <form onSubmit={onSave} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="sk-…"
          className="flex-1 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          Save key
        </button>
        {hasKey && (
          <button
            type="button"
            onClick={onRemove}
            disabled={busy}
            className="rounded-md border border-neutral-700 px-4 py-2 text-sm transition hover:bg-neutral-900 disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </form>

      {status && <p className="text-sm text-neutral-400">{status}</p>}
    </section>
  );
}
