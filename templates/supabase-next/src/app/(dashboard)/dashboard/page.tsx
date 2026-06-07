import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createProject, deleteProject } from "./actions";

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-lg border border-yellow-800 bg-yellow-950/40 p-5 text-sm text-yellow-200">
        Supabase isn&apos;t configured yet. Copy{" "}
        <code className="rounded bg-black/40 px-1">.env.example</code> to{" "}
        <code className="rounded bg-black/40 px-1">.env.local</code> and add your
        project URL and anon key.
      </div>
    );
  }

  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, description, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Scoped to your workspace via Row Level Security.
        </p>
      </section>

      <form
        action={createProject}
        className="flex flex-col gap-3 rounded-lg border border-neutral-800 p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="block text-xs text-neutral-500">Name</label>
          <input
            name="name"
            required
            placeholder="New project"
            className="mt-1 w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-neutral-500">Description</label>
          <input
            name="description"
            placeholder="Optional"
            className="mt-1 w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
        >
          Add
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {(projects ?? []).map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded-lg border border-neutral-800 px-4 py-3"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              {p.description && (
                <p className="text-sm text-neutral-400">{p.description}</p>
              )}
            </div>
            <form action={deleteProject}>
              <input type="hidden" name="id" value={p.id} />
              <button
                type="submit"
                className="text-sm text-neutral-500 transition hover:text-red-400"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
        {(!projects || projects.length === 0) && (
          <li className="rounded-lg border border-dashed border-neutral-800 px-4 py-8 text-center text-sm text-neutral-500">
            No projects yet. Create your first one above.
          </li>
        )}
      </ul>
    </div>
  );
}
