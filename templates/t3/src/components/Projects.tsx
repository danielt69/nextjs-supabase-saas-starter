"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

export function Projects() {
  const utils = api.useUtils();
  const projects = api.project.list.useQuery();
  const create = api.project.create.useMutation({
    onSuccess: async () => {
      setName("");
      setDescription("");
      await utils.project.list.invalidate();
    },
  });
  const remove = api.project.remove.useMutation({
    onSuccess: () => utils.project.list.invalidate(),
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          create.mutate({ name, description: description || undefined });
        }}
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
          disabled={create.isPending}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {create.isPending ? "Adding…" : "Add"}
        </button>
      </form>

      {create.error && (
        <p className="text-sm text-red-400">{create.error.message}</p>
      )}

      {projects.isLoading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : !projects.data || projects.data.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No projects yet. Create your first one above.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {projects.data.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-neutral-800 px-4 py-3"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                {p.description && (
                  <p className="text-sm text-neutral-500">{p.description}</p>
                )}
              </div>
              <button
                onClick={() => remove.mutate({ id: p.id })}
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
