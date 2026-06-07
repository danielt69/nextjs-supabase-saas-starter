import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export function SignIn() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && currentUser) navigate("/dashboard", { replace: true });
  }, [loading, currentUser, navigate]);

  async function onGoogle() {
    setError(null);
    setBusy(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "sign-up") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6 py-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === "sign-up" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-neutral-400">
          {mode === "sign-up"
            ? "Sign up to start building."
            : "Sign in to continue to your dashboard."}
        </p>
      </div>

      <button
        onClick={onGoogle}
        disabled={busy}
        className="rounded-md border border-neutral-700 px-4 py-2.5 text-sm font-medium transition hover:bg-neutral-900 disabled:opacity-50"
      >
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-xs text-neutral-600">
        <span className="h-px flex-1 bg-neutral-800" />
        or
        <span className="h-px flex-1 bg-neutral-800" />
      </div>

      <form onSubmit={onEmail} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {mode === "sign-up" ? "Sign up" : "Sign in"}
        </button>
      </form>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        onClick={() => {
          setError(null);
          setMode(mode === "sign-up" ? "sign-in" : "sign-up");
        }}
        className="text-sm text-neutral-500 transition hover:text-white"
      >
        {mode === "sign-up"
          ? "Already have an account? Sign in"
          : "Need an account? Sign up"}
      </button>
    </main>
  );
}
