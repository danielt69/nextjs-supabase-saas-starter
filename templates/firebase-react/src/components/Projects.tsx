import { useEffect, useState, type FormEvent } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface Project {
  id: string;
  name: string;
  description?: string;
}

export function Projects() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "projects"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Project, "id">),
        }))
      );
      setLoading(false);
    });
    return unsubscribe;
  }, [currentUser]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!currentUser || !name.trim()) return;
    await addDoc(collection(db, "projects"), {
      userId: currentUser.uid,
      name: name.trim(),
      description: description.trim() || null,
      createdAt: serverTimestamp(),
    });
    setName("");
    setDescription("");
  }

  async function onRemove(id: string) {
    await deleteDoc(doc(db, "projects", id));
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-sm text-neutral-500">
          Your projects, scoped to your account by Firestore rules.
        </p>
      </div>

      <form
        onSubmit={onCreate}
        className="flex flex-col gap-3 rounded-xl border border-neutral-800 p-4 sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs text-neutral-500">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My project"
            className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs text-neutral-500">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
            className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-neutral-500">No projects yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {projects.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-neutral-800 px-4 py-3"
            >
              <div>
                <div className="font-medium">{p.name}</div>
                {p.description && (
                  <div className="text-sm text-neutral-500">{p.description}</div>
                )}
              </div>
              <button
                onClick={() => onRemove(p.id)}
                className="text-sm text-neutral-500 transition hover:text-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
