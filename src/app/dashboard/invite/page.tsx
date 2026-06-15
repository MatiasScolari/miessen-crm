"use client";

import { useState, useEffect, useCallback } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  _count: { clients: number };
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"list" | "invite" | "create">("list");
  const [editUser, setEditUser] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Usuarias</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Gestioná las cuentas de tu equipo
        </p>
      </div>

      <div className="mb-6 flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setTab("list")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "list"
              ? "border-b-2 border-primary text-primary"
              : "text-text-secondary hover:text-text"
          }`}
        >
          Usuarias ({users.length})
        </button>
        <button
          onClick={() => { setTab("invite"); setEditUser(null); }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "invite"
              ? "border-b-2 border-primary text-primary"
              : "text-text-secondary hover:text-text"
          }`}
        >
          Invitar por email
        </button>
        <button
          onClick={() => { setTab("create"); setEditUser(null); }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "create"
              ? "border-b-2 border-primary text-primary"
              : "text-text-secondary hover:text-text"
          }`}
        >
          Crear manual
        </button>
      </div>

      {tab === "list" && (
        <UserList
          users={users}
          loading={loading}
          onEdit={(u) => { setEditUser(u); setTab("create"); }}
          onRefresh={loadUsers}
        />
      )}
      {tab === "invite" && <InviteForm />}
      {tab === "create" && (
        <UserForm
          editUser={editUser}
          onDone={() => { setEditUser(null); setTab("list"); loadUsers(); }}
        />
      )}
    </div>
  );
}

function UserList({
  users, loading, onEdit, onRefresh,
}: {
  users: User[];
  loading: boolean;
  onEdit: (u: User) => void;
  onRefresh: () => void;
}) {
  async function toggleStatus(user: User) {
    const newStatus = user.status === "active" ? "suspended" : "active";
    const res = await fetch(`/api/users/${user.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) onRefresh();
  }

  async function deleteUser(user: User) {
    if (!confirm(`¿Eliminar a ${user.name}? También se borrarán todos sus clientes.`)) return;
    const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    if (res.ok) onRefresh();
  }

  if (loading) return <p className="text-sm text-text-secondary">Cargando...</p>;

  return (
    <div className="rounded-xl border border-border bg-white divide-y divide-border">
      {users.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-text-secondary">
          No hay usuarias registradas
        </div>
      ) : (
        users.map((user) => (
          <div key={user.id} className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                user.status === "suspended"
                  ? "bg-gray-100 text-gray-400"
                  : "bg-primary-light text-primary"
              }`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className={`text-sm font-medium ${user.status === "suspended" ? "text-gray-400" : "text-text"}`}>
                  {user.name}
                  {user.status === "suspended" && (
                    <span className="ml-2 rounded bg-red-50 px-2 py-0.5 text-xs text-red-500">Suspendida</span>
                  )}
                </p>
                <p className="text-xs text-text-secondary">{user.email}</p>
                <p className="text-xs text-text-secondary/60">
                  {user._count.clients} cliente{user._count.clients !== 1 ? "s" : ""} · Creada {new Date(user.createdAt).toLocaleDateString("es-AR")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(user)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-background"
              >
                Editar
              </button>
              <button
                onClick={() => toggleStatus(user)}
                className={`rounded-lg border px-3 py-1.5 text-xs ${
                  user.status === "active"
                    ? "border-orange-200 text-orange-600 hover:bg-orange-50"
                    : "border-green-200 text-green-600 hover:bg-green-50"
                }`}
              >
                {user.status === "active" ? "Suspender" : "Activar"}
              </button>
              <button
                onClick={() => deleteUser(user)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function InviteForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string; url?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setResult({ type: "success", message: "Invitación creada", url: data.inviteUrl });
      setEmail("");
    } else {
      setResult({ type: "error", message: data.error });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-6">
      <h2 className="mb-1 text-base font-semibold text-text">Invitar por email</h2>
      <p className="mb-4 text-sm text-text-secondary">La invitada recibirá un link para crear su cuenta.</p>

      <label className="mb-1.5 block text-sm font-medium text-text">Email de la invitada</label>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vendedora@email.com"
          required
          className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Invitar"}
        </button>
      </div>

      {result && (
        <div className={`mt-4 rounded-lg p-4 text-sm ${result.type === "success" ? "bg-success-light text-green-800" : "bg-red-50 text-red-600"}`}>
          <p className="font-medium">{result.message}</p>
          {result.url && (
            <div className="mt-2">
              <p className="mb-1 text-xs">Compartí este link con la invitada:</p>
              <input
                readOnly
                value={result.url}
                onClick={(e) => e.currentTarget.select()}
                className="w-full rounded border border-green-200 bg-white px-3 py-2 text-xs text-green-800"
              />
            </div>
          )}
        </div>
      )}
    </form>
  );
}

function UserForm({ editUser, onDone }: { editUser: User | null; onDone: () => void }) {
  const [name, setName] = useState(editUser?.name || "");
  const [email, setEmail] = useState(editUser?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (editUser) {
      const body: any = {};
      if (name) body.name = name;
      if (email) body.email = email;
      if (password) body.password = password;
      if (!body.name && !body.email && !body.password) {
        setError("Cambiá al menos un campo");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) onDone();
      else {
        const data = await res.json();
        setError(data.error);
      }
    } else {
      if (!name || !email || !password) {
        setError("Todos los campos son requeridos");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) onDone();
      else {
        const data = await res.json();
        setError(data.error);
      }
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-6">
      <h2 className="mb-1 text-base font-semibold text-text">
        {editUser ? `Editar: ${editUser.name}` : "Crear usuaria manualmente"}
      </h2>
      <p className="mb-4 text-sm text-text-secondary">
        {editUser ? "Actualizá los datos de la usuaria." : "Creas la cuenta directamente, sin invitación."}
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre completo"
            required={!editUser}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vendedora@email.com"
            required={!editUser}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            {editUser ? "Nueva contraseña (dejá vacío para no cambiarla)" : "Contraseña"}
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={editUser ? "••••••••" : "Mínimo 6 caracteres"}
            minLength={editUser ? undefined : 6}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? "Guardando..." : editUser ? "Guardar cambios" : "Crear usuaria"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-border px-6 py-2.5 text-sm text-text-secondary hover:bg-background"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
