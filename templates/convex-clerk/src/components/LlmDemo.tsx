"use client";

import { useActionState } from "react";
import { runLlmDemo, type DemoResult } from "@/app/(dashboard)/settings/actions";

export function LlmDemo({ hasKey }: { hasKey: boolean }) {
  const [state, formAction, pending] = useActionState<
    DemoResult | null,
    FormData
  >(runLlmDemo, null);

  return (
    <div className="rounded-lg border border-neutral-800 p-4">
      <h2 className="font-semibold">Try it (BYOK)</h2>
      <p className="mt-1 text-sm text-neutral-400">
        Runs a prompt against an OpenAI-compatible model using your stored key.
        The key is decrypted server-side only.
      </p>

      <form action={formAction} className="mt-3 flex flex-col gap-3">
        <textarea
          name="prompt"
          rows={3}
          disabled={!hasKey}
          placeholder={
            hasKey ? "Write a haiku about Convex." : "Save an API key first."
          }
          className="w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!hasKey || pending}
          className="self-start rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {pending ? "Running…" : "Run"}
        </button>
      </form>

      {state && (
        <pre
          className={`mt-3 whitespace-pre-wrap rounded-md border p-3 text-sm ${
            state.ok
              ? "border-neutral-800 text-neutral-200"
              : "border-red-800 bg-red-950/40 text-red-300"
          }`}
        >
          {state.output}
        </pre>
      )}
    </div>
  );
}
