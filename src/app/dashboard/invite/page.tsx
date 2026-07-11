"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/Toast";
import { ConfirmModal } from "@/components/ConfirmModal";

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
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"list" | "invite" | "create">("list");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null);
  const [suspendAction, setSuspendAction] = useState<"suspend" | "activate">("suspend");

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  async function toggleStatus(user: User) {
    const newStatus = user.status === "active" ? "suspended" : "active";
    const res = await fetch(`/api/users/${user.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      toast("success", newStatus === "suspended" ? "Cuenta suspendida" : "Cuenta activada");
      loadUsers();
    }
  }

  async function deleteUser() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/users/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      toast("success", "Usuaria eliminada");
      setDeleteTarget(null);
      loadUsers();
    }
  }

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Usuarias</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Gestioná las cuentas de tu equipo
        </p>
      </div>

      <div className="mb-6 flex gap-1 rounded-xl bg-background p-1">
        {(["list", "invite", "create"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setEditUser(null); }}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              tab === t
                ? "bg-white text-text shadow-sm"
                : "text-text-secondary hover:text-text"
            }`}
          >
            {t === "list" ? `Usuarias (${users.length})` : t === "invite" ? "Invitar" : "Crear manual"}
          </button>
        ))}
      </div>

      {tab === "list" && (
        <div className="rounded-2xl border border-border bg-white shadow-sm divide-y divide-border/60">
          {loading ? (
            <div className="space-y-4 px-6 py-8">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-border" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-border" />
                    <div className="h-3 w-48 animate-pulse rounded bg-border" />
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-2xl">
                👤
              </div>
              <p className="text-sm text-text-secondary">No hay usuarias registradas</p>
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-background/40">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    user.status === "suspended"
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gradient-to-br from-primary-light to-primary-lighter text-primary"
                  }`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${user.status === "suspended" ? "text-text-muted" : "text-text"}`}>
                      {user.name}
                      {user.status === "suspended" && (
                        <span className="ml-2 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-text-muted">
                          Suspendida
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-text-secondary">{user.email}</p>
                    <p className="text-xs text-text-muted">
                      {user._count.clients} cliente{user._count.clients !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditUser(user); setTab("create"); }}
                    className="rounded-xl border border-border/60 px-3 py-1.5 text-xs text-text-secondary transition-all hover:border-primary/30 hover:bg-primary-light hover:text-primary"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setSuspendTarget(user);
                      setSuspendAction(user.status === "active" ? "suspend" : "activate");
                    }}
                    className={`rounded-xl border px-3 py-1.5 text-xs transition-all ${
                      user.status === "active"
                        ? "border-orange-200 text-orange-600 hover:bg-orange-50"
                        : "border-green-200 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {user.status === "active" ? "Suspender" : "Activar"}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(user)}
                    className="rounded-xl border border-danger/20 px-3 py-1.5 text-xs text-danger transition-all hover:bg-danger-light"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "invite" && (
        <InviteForm
          onSuccess={() => { toast("success", "Invitación creada"); loadUsers(); }}
        />
      )}

      {tab === "create" && (
        <UserForm
          editUser={editUser}
          onDone={() => {
            toast("success", editUser ? "Usuaria actualizada" : "Usuaria creada");
            setEditUser(null);
            setTab("list");
            loadUsers();
          }}
        />
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar usuaria"
        message={`¿Eliminar a ${deleteTarget?.name}? También se borrarán todos sus clientes y notas.`}
        confirmLabel="Eliminar"
        danger
        onConfirm={deleteUser}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        open={!!suspendTarget}
        title={suspendAction === "suspend" ? "Suspender cuenta" : "Activar cuenta"}
        message={
          suspendAction === "suspend"
            ? `¿Suspendé a ${suspendTarget?.name}? No va a poder iniciar sesión hasta que la actives.`
            : `¿Activá a ${suspendTarget?.name}? Va a poder iniciar sesión nuevamente.`
        }
        confirmLabel={suspendAction === "suspend" ? "Suspender" : "Activar"}
        danger={suspendAction === "suspend"}
        onConfirm={() => {
          if (suspendTarget) toggleStatus(suspendTarget);
          setSuspendTarget(null);
        }}
        onCancel={() => setSuspendTarget(null)}
      />
    </div>
  );
}

function InviteForm({ onSuccess }: { onSuccess: () => void }) {
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
      onSuccess();
    } else {
      setResult({ type: "error", message: data.error });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="animate-slide-up rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-text">Invitar por email</h2>
      <p className="mb-4 text-sm text-text-secondary">La invitada recibirá un link único para crear su cuenta.</p>
      <label className="mb-1.5 block text-sm font-medium text-text">Email</label>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vendedora@email.com"
          required
          className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Invitar"}
        </button>
      </div>
      {result && (
        <div className={`mt-4 animate-fade-in rounded-xl p-4 text-sm ${
          result.type === "success"
            ? "bg-success-light text-green-700"
            : "bg-danger-light text-danger"
        }`}>
          <p className="font-medium">{result.message}</p>
          {result.url && (
            <div className="mt-2">
              <p className="mb-1 text-xs">Compartí este link con la invitada:</p>
              <input
                readOnly
                value={result.url}
                onClick={(e) => e.currentTarget.select()}
                className="w-full rounded-lg border border-success/30 bg-white px-3 py-2 text-xs text-green-700"
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
      else { const d = await res.json(); setError(d.error); }
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
      else { const d = await res.json(); setError(d.error); }
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="animate-slide-up rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-text">
        {editUser ? `Editar: ${editUser.name}` : "Crear usuaria manualmente"}
      </h2>
      <p className="mb-4 text-sm text-text-secondary">
        {editUser ? "Actualizá los datos. Dejá la contraseña vacía si no querés cambiarla." : "Creás la cuenta directamente, sin invitación."}
      </p>

      {error && (
        <div className="mb-4 animate-fade-in rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">{error}</div>
      )}

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre completo"
            required={!editUser}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vendedora@email.com"
            required={!editUser}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-text">
            {editUser ? "Nueva contraseña (opcional)" : "Contraseña"}
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={editUser ? "Dejá vacío para mantener la actual" : "Mínimo 6 caracteres"}
            minLength={editUser ? undefined : 6}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md disabled:opacity-50"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}
          {loading ? "Guardando..." : editUser ? "Guardar cambios" : "Crear usuaria"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-xl border border-border/60 px-6 py-2.5 text-sm text-text-secondary transition-all hover:border-border hover:bg-background"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
