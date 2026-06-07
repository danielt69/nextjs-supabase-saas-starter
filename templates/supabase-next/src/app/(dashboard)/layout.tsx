import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already gates these routes; this is defense-in-depth.
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6">
      <header className="flex items-center justify-between border-b border-neutral-800 py-4">
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/dashboard" className="font-semibold">
            Dashboard
          </Link>
          <Link href="/settings" className="text-neutral-400 hover:text-white">
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-3 text-sm text-neutral-400">
          <span className="hidden sm:inline">{user.email}</span>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-md border border-neutral-700 px-3 py-1.5 transition hover:bg-neutral-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 py-8">{children}</main>
    </div>
  );
}
