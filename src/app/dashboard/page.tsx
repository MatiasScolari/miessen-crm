import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id!;

  const totalClients = await prisma.client.count({
    where: { userId },
  });

  const recentClients = await prisma.client.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      notes: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const clientsToday = await prisma.client.count({
    where: {
      userId,
      createdAt: { gte: today },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Panel de control</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Resumen de tu actividad
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Clientes totales
              </p>
              <p className="mt-1 text-3xl font-bold text-text">
                {totalClients}
              </p>
            </div>
            <span className="text-3xl">👥</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Agregados hoy
              </p>
              <p className="mt-1 text-3xl font-bold text-text">
                {clientsToday}
              </p>
            </div>
            <span className="text-3xl">📅</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Últimos clientes
              </p>
              <p className="mt-1 text-3xl font-bold text-primary">
                {totalClients}
              </p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-text">
            Últimos clientes agregados
          </h2>
          <Link
            href="/dashboard/clients"
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            Ver todos
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentClients.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-text-secondary">
                Todavía no tenés clientes
              </p>
              <Link
                href="/dashboard/clients"
                className="mt-2 inline-block text-sm font-medium text-primary hover:text-primary-dark"
              >
                Agregar tu primer cliente
              </Link>
            </div>
          ) : (
            recentClients.map((client) => (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-background/50"
              >
                <div>
                  <p className="text-sm font-medium text-text">{client.name}</p>
                  <p className="text-xs text-text-secondary">{client.phone}</p>
                </div>
                <div className="text-right">
                  {client.notes[0] && (
                    <p className="max-w-48 truncate text-xs text-text-secondary">
                      {client.notes[0].content}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-text-secondary/60">
                    {new Date(client.createdAt).toLocaleDateString("es-AR")}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
