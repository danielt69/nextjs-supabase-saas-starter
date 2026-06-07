"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function Projects() {
  const projects = useQuery(api.projects.list);
  const createProject = useMutation(api.projects.create);
  const removeProject = useMutation(api.projects.remove);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    if (!name) return;
    setPending(true);
    try {
      await createProject({
        name,
        description: String(data.get("description") ?? "").trim() || undefined,
      });
      form.reset();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={onSubmit}
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
          disabled={pending}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add"}
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {projects === undefined && (
          <li className="rounded-lg border border-dashed border-neutral-800 px-4 py-8 text-center text-sm text-neutral-500">
            Loading…
          </li>
        )}
        {projects?.map((p) => (
          <li
            key={p._id}
            className="flex items-center justify-between rounded-lg border border-neutral-800 px-4 py-3"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              {p.description && (
                <p className="text-sm text-neutral-400">{p.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeProject({ id: p._id as Id<"projects"> })}
              className="text-sm text-neutral-500 transition hover:text-red-400"
            >
              Delete
            </button>
          </li>
        ))}
        {projects?.length === 0 && (
          <li className="rounded-lg border border-dashed border-neutral-800 px-4 py-8 text-center text-sm text-neutral-500">
            No projects yet. Create your first one above.
          </li>
        )}
      </ul>
    </div>
  );
}
