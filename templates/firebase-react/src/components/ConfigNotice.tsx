export function ConfigNotice() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6 py-20">
      <h1 className="text-2xl font-bold">Almost there</h1>
      <p className="text-neutral-400">
        Firebase isn&apos;t configured yet. Copy{" "}
        <code className="rounded bg-neutral-900 px-1.5 py-0.5">.env.example</code>{" "}
        to <code className="rounded bg-neutral-900 px-1.5 py-0.5">.env.local</code>{" "}
        and fill in your Firebase web app config.
      </p>
      <p className="text-sm text-neutral-600">
        See the README for the full setup walkthrough.
      </p>
    </main>
  );
}
