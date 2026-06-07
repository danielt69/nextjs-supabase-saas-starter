import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/server/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col gap-6 border-r border-neutral-800 px-4 py-6">
        <div className="px-2 text-sm font-semibold tracking-tight">
          T3 Starter
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          <Link
            href="/dashboard"
            className="rounded-md px-3 py-2 text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
          >
            Projects
          </Link>
          <Link
            href="/settings"
            className="rounded-md px-3 py-2 text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
          >
            Settings
          </Link>
        </nav>
        <div className="mt-auto flex flex-col gap-2 px-2">
          <span className="truncate text-xs text-neutral-500">
            {session.user.email ?? session.user.name ?? "Signed in"}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-neutral-400 transition hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
