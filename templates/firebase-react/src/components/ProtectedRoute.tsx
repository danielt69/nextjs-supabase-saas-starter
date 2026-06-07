import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-sm text-neutral-500">Loading…</div>;
  }
  if (!currentUser) {
    return <Navigate to="/sign-in" replace />;
  }
  return <>{children}</>;
}
