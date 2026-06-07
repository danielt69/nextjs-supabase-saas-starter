"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

export function LlmDemo() {
  const complete = api.llm.complete.useMutation();
  const [prompt, setPrompt] = useState(
    "Write a one-line tagline for a SaaS starter kit."
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 p-5">
      <h2 className="font-semibold">LLM demo</h2>
      <p className="text-sm text-neutral-400">
        Runs your prompt through the provider key you saved in Settings. The key
        is decrypted server-side inside the tRPC procedure — it never returns to
        the browser.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-500"
      />
      <div>
        <button
          onClick={() => complete.mutate({ prompt })}
          disabled={complete.isPending}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {complete.isPending ? "Running…" : "Run"}
        </button>
      </div>
      {complete.error && (
        <p className="text-sm text-red-400">{complete.error.message}</p>
      )}
      {complete.data && (
        <pre className="whitespace-pre-wrap rounded-md bg-neutral-950 p-3 text-sm text-neutral-200">
          {complete.data.text}
        </pre>
      )}
    </div>
  );
}
