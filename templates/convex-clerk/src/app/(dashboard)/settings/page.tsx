import { isConfigured } from "@/lib/env";
import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { getConvexToken } from "@/lib/convexServer";
import { ProviderKeyForm } from "@/components/ProviderKeyForm";
import { LlmDemo } from "@/components/LlmDemo";

export default async function SettingsPage() {
  if (!isConfigured()) {
    return (
      <div className="rounded-lg border border-yellow-800 bg-yellow-950/40 p-5 text-sm text-yellow-200">
        Convex and Clerk aren&apos;t configured yet. See{" "}
        <code className="rounded bg-black/40 px-1">.env.example</code>.
      </div>
    );
  }

  const token = await getConvexToken();
  const hasKey = token
    ? await fetchQuery(api.providerKeys.has, {}, { token })
    : false;

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Bring your own LLM provider key. It is encrypted at rest with
          AES-256-GCM before being stored in Convex.
        </p>
      </section>

      <ProviderKeyForm hasKey={hasKey} />
      <LlmDemo hasKey={hasKey} />
    </div>
  );
}
