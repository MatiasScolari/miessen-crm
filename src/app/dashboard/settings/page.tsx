"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/components/Toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    const res = await fetch("/api/users/me");
    if (res.ok) {
      const data = await res.json();
      setName(data.name);
      setEmail(data.email);
      setAvatar(data.avatar);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarFile(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body: any = {};
    if (name.trim()) body.name = name.trim();
    if (password) body.password = password;
    if (avatarFile) body.avatar = avatarFile;

    if (Object.keys(body).length === 0) {
      setError("No hay cambios para guardar");
      setSaving(false);
      return;
    }

    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast("success", "Perfil actualizado");
      setPassword("");
      if (avatarFile) setAvatar(avatarFile);
      setAvatarFile(null);
    } else {
      const d = await res.json();
      setError(d.error || "Error al guardar");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg animate-fade-in">
        <div className="mb-6 h-8 w-40 animate-pulse rounded bg-border" />
        <div className="space-y-4 rounded-2xl border border-border bg-white p-6">
          <div className="mx-auto h-24 w-24 animate-pulse rounded-full bg-border" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-11 w-full animate-pulse rounded-xl bg-border" />
          ))}
        </div>
      </div>
    );
  }

  const previewUrl = avatarFile || avatar;

  return (
    <div className="mx-auto max-w-lg animate-fade-in">
      <h1 className="mb-6 text-2xl font-bold text-text">Configuración</h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="mb-4 animate-fade-in rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="mb-6 flex flex-col items-center gap-3">
          <div
            onClick={() => fileRef.current?.click()}
            className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 border-border bg-background transition-all hover:border-primary/50 hover:shadow-md"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-light to-primary-lighter text-2xl font-bold text-primary">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-sm font-medium text-white opacity-0 transition-all hover:bg-black/40 hover:opacity-100">
              Cambiar foto
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <p className="text-xs text-text-muted">Hacé clic para cambiar la foto</p>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-text">Email</label>
          <input
            value={email}
            disabled
            className="w-full rounded-xl border border-border bg-gray-50 px-4 py-2.5 text-sm text-text-muted outline-none"
          />
          <p className="mt-1 text-xs text-text-muted">El email no se puede cambiar</p>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-text">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-text">
            Nueva contraseña
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Dejá vacío para mantener la actual"
            minLength={6}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
          />
          <p className="mt-1 text-xs text-text-muted">
            Mínimo 6 caracteres. Dejá vacío si no querés cambiarla.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md disabled:opacity-50"
        >
          {saving && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
