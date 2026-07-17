"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Panel", icon: "📊" },
  { href: "/dashboard/clients", label: "Clientes", icon: "👥" },
];

export default function Sidebar({
  userName,
  userEmail,
  role,
}: {
  userName: string;
  userEmail: string;
  role?: string;
}) {
  const pathname = usePathname();

  const navLinks = role === "admin"
    ? [...links, { href: "/dashboard/invite", label: "Usuarios", icon: "👥" }]
    : links;

  return (
    <aside className="fixed flex h-screen w-64 flex-col border-r border-border/60 bg-white">
      <div className="flex items-center gap-2.5 border-b border-border/60 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-sm font-bold text-white shadow-sm">
          A
        </div>
        <span className="text-base font-semibold text-text">Alumia</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navLinks.map((link) => {
          const isActive = link.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-text-secondary hover:bg-background hover:text-text"
              }`}
            >
              <span className={isActive ? "" : "opacity-70"}>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-4">
        <div className="mb-3 flex items-center gap-3 px-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-xs font-bold text-white shadow-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text">{userName}</p>
            <p className="truncate text-xs text-text-secondary">{userEmail}</p>
          </div>
        </div>
        <Link
          href="/api/auth/signout"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 px-4 py-2.5 text-sm text-text-secondary transition-all hover:border-border hover:bg-background hover:text-text"
        >
          Cerrar sesión
        </Link>
      </div>
    </aside>
  );
}
