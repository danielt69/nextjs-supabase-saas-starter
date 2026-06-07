"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

export function ProviderKeyForm() {
  const utils = api.useUtils();
  const status = api.providerKey.status.useQuery();
  const save = api.providerKey.save.useMutation({
    onSuccess: async () => {
      setValue("");
      await utils.providerKey.status.invalidate();
    },
  });
  const remove = api.providerKey.remove.useMutation({
    onSuccess: () => utils.providerKey.status.invalidate(),
  });

  const [value, setValue] = useState("");
  const hasKey = status.data?.hasKey;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-800 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Provider API key</h2>
        <span className={`text-xs ${hasKey ? "text-green-400" : "text-neutral-500"}`}>
          {status.isLoading
            ? "Checking…"
            : hasKey
              ? "Key saved"
              : "No key saved"}
        </span>
      </div>
      <p className="text-sm text-neutral-400">
        Stored encrypted at rest (AES-256-GCM). The plaintext is only decrypted
        server-side, inside the tRPC procedure, just before an outbound LLM call.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!value.trim()) return;
          save.mutate({ apiKey: value });
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
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
          disabled={save.isPending}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {save.isPending ? "Saving…" : "Save"}
        </button>
      </form>
      {hasKey && (
        <button
          onClick={() => remove.mutate()}
          className="self-start text-sm text-neutral-500 transition hover:text-red-400"
        >
          Remove saved key
        </button>
      )}
      {save.error && <p className="text-sm text-red-400">{save.error.message}</p>}
    </div>
  );
}
