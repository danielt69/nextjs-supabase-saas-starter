import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function Projects() {
  const projects = useQuery(api.projects.list);
  const create = useMutation(api.projects.create);
  const remove = useMutation(api.projects.remove);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await create({ name, description: description || undefined });
      setName("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={onCreate}
        className="flex flex-col gap-3 rounded-xl border border-neutral-800 p-5 sm:flex-row sm:items-end"
      >
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="text-neutral-400">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My project"
            className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-neutral-500"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="text-neutral-400">Description (optional)</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What it does"
            className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-neutral-500"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {busy ? "Adding…" : "Add"}
        </button>
      </form>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {projects === undefined ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No projects yet. Create your first one above.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {projects.map((p) => (
            <li
              key={p._id}
              className="flex items-center justify-between rounded-lg border border-neutral-800 px-4 py-3"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                {p.description && (
                  <p className="text-sm text-neutral-500">{p.description}</p>
                )}
              </div>
              <button
                onClick={() => remove({ id: p._id as Id<"projects"> })}
                className="text-sm text-neutral-500 transition hover:text-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
