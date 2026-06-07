import { isConfigured } from "@/lib/env";
import { Projects } from "@/components/Projects";

export default function DashboardPage() {
  if (!isConfigured()) {
    return (
      <div className="rounded-lg border border-yellow-800 bg-yellow-950/40 p-5 text-sm text-yellow-200">
        Convex and Clerk aren&apos;t configured yet. Copy{" "}
        <code className="rounded bg-black/40 px-1">.env.example</code> to{" "}
        <code className="rounded bg-black/40 px-1">.env.local</code>, run{" "}
        <code className="rounded bg-black/40 px-1">npx convex dev</code>, and add
        your Clerk keys.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Scoped to your workspace and stored in Convex. The list updates live.
        </p>
      </section>
      <Projects />
    </div>
  );
}
