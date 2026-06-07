import { LlmDemo } from "@/components/LlmDemo";
import { ProviderKeyForm } from "@/components/ProviderKeyForm";

export function Settings() {
  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-500">
          Manage your bring-your-own-key LLM provider.
        </p>
      </div>
      <ProviderKeyForm />
      <LlmDemo />
    </div>
  );
}
