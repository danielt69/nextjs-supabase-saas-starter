import { NavLink, Outlet } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

const links = [
  { to: "/dashboard", label: "Projects" },
  { to: "/settings", label: "Settings" },
];

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col gap-6 border-r border-neutral-800 px-4 py-6">
        <div className="px-2 text-sm font-semibold tracking-tight">
          Convex Starter
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 transition ${
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-2">
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>
      <main className="flex-1 px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
