import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Proxy (clerkMiddleware) already gates these routes; this is defense-in-depth.
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    redirect("/sign-in");
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
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="flex-1 py-8">{children}</main>
    </div>
  );
}
