import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as { name?: string; email?: string; role?: string };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed flex h-screen w-64 flex-col border-r border-border bg-white">
        <div className="flex items-center gap-2 border-b border-border px-6 py-5">
          <span className="text-xl">🍳</span>
          <span className="text-base font-semibold text-text">
            Mi<span className="text-primary">Essen</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text"
          >
            <span>📊</span>
            Panel
          </Link>
          <Link
            href="/dashboard/clients"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text"
          >
            <span>👥</span>
            Clientes
          </Link>
          {user.role === "admin" && (
            <Link
              href="/dashboard/invite"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text"
            >
              <span>✉️</span>
              Invitar
            </Link>
          )}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3 px-1">
            <p className="text-sm font-medium text-text truncate">
              {user.name}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {user.email}
            </p>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex w-full items-center justify-center rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-background hover:text-text"
          >
            Cerrar sesión
          </Link>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
