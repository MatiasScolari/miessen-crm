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
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null);
  const [suspendAction, setSuspendAction] = useState<"suspend" | "activate">("suspend");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/users");
    if (res.ok) {
      const data = await res.json();
      data.sort((a: User, b: User) => {
        if (a.role === "admin") return -1;
        if (b.role === "admin") return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setUsers(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  function resetForm() {
    setForm({ name: "", email: "", password: "" });
    setEditUser(null);
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (editUser) {
      const body: any = {};
      if (form.name) body.name = form.name;
      if (form.email) body.email = form.email;
      if (form.password) body.password = form.password;
      if (!body.name && !body.email && !body.password) {
        setError("Cambiá al menos un campo");
        setSaving(false);
        return;
      }
      const res = await fetch(`/api/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast("success", "Usuario actualizado");
        resetForm();
        loadUsers();
      } else {
        const d = await res.json();
        setError(d.error);
      }
    } else {
      if (!form.name || !form.email || !form.password) {
        setError("Todos los campos son requeridos");
        setSaving(false);
        return;
      }
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast("success", "Usuario creado");
        resetForm();
        loadUsers();
      } else {
        const d = await res.json();
        setError(d.error);
      }
    }
    setSaving(false);
  }

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
      toast("success", "Usuario eliminado");
      setDeleteTarget(null);
      loadUsers();
    }
  }

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Usuarios</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {users.length} usuario{users.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
        >
          {showForm ? "✕ Cancelar" : "+ Crear Usuario"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 animate-slide-up rounded-2xl border border-border bg-white p-6 shadow-sm"
        >
          <h2 className="mb-1 text-base font-semibold text-text">
            {editUser ? `Editar: ${editUser.name}` : "Nuevo usuario"}
          </h2>
          <p className="mb-4 text-sm text-text-secondary">
            {editUser
              ? "Dejá la contraseña vacía si no querés cambiarla."
              : "Creá la cuenta con los datos de la vendedora."}
          </p>

          {error && (
            <div className="mb-4 animate-fade-in rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Nombre</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nombre completo"
                required={!editUser}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="vendedora@email.com"
                required={!editUser}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">
                {editUser ? "Nueva contraseña" : "Contraseña"}
              </label>
              <input
                type="text"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={editUser ? "Dejá vacío para mantener" : "Mínimo 6 caracteres"}
                minLength={editUser ? undefined : 6}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md disabled:opacity-50"
            >
              {saving && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
              {saving ? "Guardando..." : editUser ? "Guardar cambios" : "Crear usuario"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-border/60 px-6 py-2.5 text-sm text-text-secondary transition-all hover:border-border hover:bg-background"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

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
              👥
            </div>
            <p className="text-sm text-text-secondary">No hay usuarios registrados</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between px-6 py-4 transition-colors hover:bg-background/40 ${
                user.role === "admin" ? "bg-primary-lighter/50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  user.role === "admin"
                    ? "bg-gradient-to-br from-primary to-primary-dark text-white"
                    : user.status === "suspended"
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gradient-to-br from-primary-light to-primary-lighter text-primary"
                }`}>
                  {user.role === "admin" ? "⭐" : user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={`text-sm font-medium ${user.status === "suspended" ? "text-text-muted" : "text-text"}`}>
                    {user.name}
                    {user.role === "admin" && (
                      <span className="ml-2 rounded-md bg-primary-light px-2 py-0.5 text-xs text-primary">
                        Superadmin
                      </span>
                    )}
                    {user.status === "suspended" && (
                      <span className="ml-2 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-text-muted">
                        Suspendido
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-text-secondary">{user.email}</p>
                  {user.role !== "admin" && (
                    <p className="text-xs text-text-muted">
                      {user._count.clients} cliente{user._count.clients !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
              {user.role !== "admin" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditUser(user);
                      setForm({ name: user.name, email: user.email, password: "" });
                      setShowForm(true);
                    }}
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
              )}
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar usuario"
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
            ? `¿Suspender a ${suspendTarget?.name}? No va a poder iniciar sesión.`
            : `¿Activar a ${suspendTarget?.name}? Va a poder iniciar sesión nuevamente.`
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
