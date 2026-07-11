import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id!;

  const totalClients = await prisma.client.count({ where: { userId } });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const clientsToday = await prisma.client.count({
    where: { userId, createdAt: { gte: today } },
  });

  const recentClients = await prisma.client.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      notes: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const stats = [
    { label: "Clientes totales", value: totalClients, icon: "👥", color: "from-primary to-primary-dark" },
    { label: "Agregados hoy", value: clientsToday, icon: "📅", color: "from-secondary to-amber-600" },
    { label: "Con notas", value: recentClients.filter((c) => c.notes.length > 0).length, icon: "📝", color: "from-success to-emerald-600" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Panel de control</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Resumen de tu actividad
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="animate-slide-up rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:shadow-md"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  {stat.label}
                </p>
                <p className="mt-1 text-3xl font-bold text-text">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-xl text-white shadow-sm`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="animate-slide-up rounded-2xl border border-border bg-white shadow-sm" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <h2 className="text-base font-semibold text-text">
            Últimos clientes
          </h2>
          <Link
            href="/dashboard/clients"
            className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            Ver todos →
          </Link>
        </div>
        <div className="divide-y divide-border/60">
          {recentClients.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-2xl">
                👥
              </div>
              <p className="text-sm text-text-secondary">
                Todavía no tenés clientes
              </p>
              <Link
                href="/dashboard/clients"
                className="mt-2 inline-block text-sm font-medium text-primary transition-colors hover:text-primary-dark"
              >
                Agregar tu primer cliente →
              </Link>
            </div>
          ) : (
            recentClients.map((client, i) => (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-background/60"
                style={{ animationDelay: `${0.3 + i * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary-lighter text-sm font-semibold text-primary">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">
                      {client.name}
                    </p>
                    <p className="text-xs text-text-secondary">{client.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {client.notes[0] && (
                    <p className="hidden max-w-40 truncate text-xs text-text-muted md:block">
                      {client.notes[0].content}
                    </p>
                  )}
                  <span className="text-xs text-text-muted">
                    {new Date(client.createdAt).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
