"use client";

import { saveProviderKey, deleteProviderKey } from "@/app/(dashboard)/settings/actions";

export function ProviderKeyForm({ hasKey }: { hasKey: boolean }) {
  return (
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
  );
}
