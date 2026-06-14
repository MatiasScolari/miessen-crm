"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    paymentMethod: "",
  });
  const [saving, setSaving] = useState(false);

  const loadClients = useCallback(async () => {
    const res = await fetch("/api/clients");
    if (res.ok) {
      const data = await res.json();
      setClients(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ name: "", phone: "", email: "", paymentMethod: "" });
      setShowForm(false);
      await loadClients();
    }
    setSaving(false);
  }

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Mis clientes</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {clients.length} cliente{clients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          {showForm ? "Cancelar" : "+ Nuevo cliente"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-8 rounded-xl border border-border bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-base font-semibold text-text">
            Nuevo cliente
          </h2>
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">
                Nombre *
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nombre completo"
                required
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">
                Teléfono *
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="11 2345-6789"
                required
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">
                Email
              </label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="cliente@email.com"
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">
                Medio de pago
              </label>
              <input
                value={form.paymentMethod}
                onChange={(e) =>
                  setForm({ ...form, paymentMethod: e.target.value })
                }
                placeholder="Efectivo, transferencia, Mercado Pago..."
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cliente"}
          </button>
        </form>
      )}

      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o teléfono..."
          className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="rounded-xl border border-border bg-white">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-text-secondary">
            Cargando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-text-secondary">
              {search
                ? "No se encontraron clientes"
                : "Todavía no tenés clientes registrados"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((client) => (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-background/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">
                      {client.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {client.phone}
                      {client.paymentMethod && ` · ${client.paymentMethod}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
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
                  <span className="text-xs text-text-secondary/60">
                    {new Date(client.createdAt).toLocaleDateString("es-AR")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
