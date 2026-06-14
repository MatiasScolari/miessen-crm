"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Client = {
  id: string;
  name: string;
  phone: string;
  email: string;
  paymentMethod: string;
  createdAt: string;
  notes: { id: string; content: string; createdAt: string }[];
};

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    paymentMethod: "",
  });

  async function loadClient() {
    const res = await fetch(`/api/clients/${id}`);
    if (res.ok) {
      const data = await res.json();
      setClient(data);
      setForm({
        name: data.name,
        phone: data.phone,
        email: data.email,
        paymentMethod: data.paymentMethod,
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadClient();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setEditing(false);
      await loadClient();
    }
  }

  async function handleDelete() {
    if (!confirm("¿Estás segura de eliminar este cliente?")) return;

    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/clients");
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSavingNote(true);
    const res = await fetch(`/api/clients/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newNote }),
    });
    if (res.ok) {
      setNewNote("");
      await loadClient();
    }
    setSavingNote(false);
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-text-secondary">
        Cargando...
      </div>
    );
  }

  if (!client) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-secondary">Cliente no encontrado</p>
        <Link
          href="/dashboard/clients"
          className="mt-2 inline-block text-sm text-primary hover:text-primary-dark"
        >
          Volver a clientes
        </Link>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/54${client.phone.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(client.name.split(" ")[0])}%2C%20te%20escribo%20de%20Essen%20para%20contarte%20las%20novedades%20de%20esta%20semana%20💕`;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/dashboard/clients"
          className="text-sm text-text-secondary hover:text-text"
        >
          ← Volver a clientes
        </Link>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-white p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-xl font-bold text-primary">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              {editing ? (
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="text-xl font-bold text-text outline-none border-b-2 border-primary pb-1"
                />
              ) : (
                <h1 className="text-xl font-bold text-text">{client.name}</h1>
              )}
              <p className="text-sm text-text-secondary">
                Cliente desde{" "}
                {new Date(client.createdAt).toLocaleDateString("es-AR")}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(!editing)}
              className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-background hover:text-text"
            >
              {editing ? "Cancelar" : "Editar"}
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
            >
              Eliminar
            </button>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-text">
                  Nombre
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">
                  Teléfono
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">
                  Email
                </label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Guardar cambios
            </button>
          </form>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-text-secondary">
                Teléfono
              </p>
              <p className="mt-0.5 text-sm text-text">{client.phone}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-text-secondary">Email</p>
              <p className="mt-0.5 text-sm text-text">
                {client.email || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-text-secondary">
                Medio de pago
              </p>
              <p className="mt-0.5 text-sm text-text">
                {client.paymentMethod || "—"}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-success px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
          >
            💬 Enviar WhatsApp
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-text">Notas</h2>

        <form onSubmit={handleAddNote} className="mb-6">
          <div className="flex gap-2">
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Ej: Me pidió que la contacte a fin de mes..."
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={savingNote || !newNote.trim()}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {savingNote ? "..." : "Agregar"}
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {client.notes.length === 0 ? (
            <p className="py-6 text-center text-sm text-text-secondary">
              No hay notas todavía. Agregá un recordatorio para este cliente.
            </p>
          ) : (
            client.notes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg bg-background p-4"
              >
                <p className="text-sm text-text">{note.content}</p>
                <p className="mt-1 text-xs text-text-secondary/60">
                  {new Date(note.createdAt).toLocaleString("es-AR")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
