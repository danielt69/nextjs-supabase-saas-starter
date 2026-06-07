import { ProviderKeyForm } from "@/components/ProviderKeyForm";

export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Manage your bring-your-own-key provider credentials.
        </p>
      </section>
      <ProviderKeyForm />
    </div>
  );
}
