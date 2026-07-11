"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import { ConfirmModal } from "@/components/ConfirmModal";

type Client = {
  id: string;
  name: string;
  phone: string;
  email: string;
  paymentMethod: string;
  createdAt: string;
  notes: { content: string; createdAt: string }[];
};

export default function ClientsPage() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", paymentMethod: "",
  });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  const loadClients = useCallback(async () => {
    const res = await fetch("/api/clients");
    if (res.ok) setClients(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { loadClients(); }, [loadClients]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast("success", "Cliente agregado");
      setForm({ name: "", phone: "", email: "", paymentMethod: "" });
      setShowForm(false);
      await loadClients();
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/clients/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      toast("success", "Cliente eliminado");
      setDeleteTarget(null);
      await loadClients();
    }
  }

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Mis clientes</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {clients.length} cliente{clients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
        >
          {showForm ? "✕ Cancelar" : "+ Nuevo cliente"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 animate-slide-up rounded-2xl border border-border bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-base font-semibold text-text">Nuevo cliente</h2>
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Nombre *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nombre completo"
                required
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Teléfono *</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="11 2345-6789"
                required
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="cliente@email.com"
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Medio de pago</label>
              <input
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                placeholder="Efectivo, transferencia..."
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md disabled:opacity-50"
          >
            {saving && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {saving ? "Guardando..." : "Guardar cliente"}
          </button>
        </form>
      )}

      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o teléfono..."
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
        />
      </div>

      <div className="rounded-2xl border border-border bg-white shadow-sm">
        {loading ? (
          <div className="space-y-4 px-6 py-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-border" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-border" />
                  <div className="h-3 w-24 animate-pulse rounded bg-border" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-2xl">
              👥
            </div>
            <p className="text-sm text-text-secondary">
              {search
                ? "No se encontraron clientes"
                : "Todavía no tenés clientes registrados"}
            </p>
            {!search && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
              >
                Agregar tu primer cliente →
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filtered.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-background/40"
              >
                <Link
                  href={`/dashboard/clients/${client.id}`}
                  className="flex flex-1 items-center gap-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary-lighter text-sm font-semibold text-primary">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text">
                      {client.name}
                    </p>
                    <p className="truncate text-xs text-text-secondary">
                      {client.phone}
                      {client.paymentMethod && ` · ${client.paymentMethod}`}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/54${client.phone.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(client.name.split(" ")[0])}%2C%20%C2%BFc%C3%B3mo%20est%C3%A1s%3F`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-light text-sm transition-colors hover:bg-success hover:text-white"
                    title="Enviar WhatsApp"
                  >
                    💬
                  </a>
                  <button
                    onClick={() => setDeleteTarget(client)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-xs text-text-muted transition-colors hover:border-danger/30 hover:bg-danger-light hover:text-danger"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar cliente"
        message={`¿Estás segura de eliminar a ${deleteTarget?.name}? También se borrarán todas sus notas.`}
        confirmLabel="Eliminar"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
