"use client";

import { useState } from "react";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
    url?: string;
  } | null>(null);

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
      setResult({
        type: "success",
        message: "Invitación creada",
        url: data.inviteUrl,
      });
      setEmail("");
    } else {
      setResult({ type: "error", message: data.error });
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Invitar usuaria</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Invitá a otra vendedora a usar la plataforma. Recibirá un link para
          crear su cuenta.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-xl border border-border bg-white p-6"
      >
        <label className="mb-1.5 block text-sm font-medium text-text">
          Email de la invitada
        </label>
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
          <div
            className={`mt-4 rounded-lg p-4 text-sm ${
              result.type === "success"
                ? "bg-success-light text-green-800"
                : "bg-red-50 text-red-600"
            }`}
          >
            <p className="font-medium">{result.message}</p>
            {result.url && (
              <div className="mt-2">
                <p className="mb-1 text-xs">
                  Compartí este link con la invitada:
                </p>
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

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-3 text-base font-semibold text-text">
          ¿Cómo funciona?
        </h2>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">1.</span>
            <span>
              Ingresás el email de la vendedora que querés invitar.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">2.</span>
            <span>
              Se genera un link de invitación único que podés compartirle.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">3.</span>
            <span>
              Ella crea su cuenta y empieza a gestionar sus propios clientes.
              Tú como admin ves todo.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">4.</span>
            <span>
              Cada vendedora tiene su espacio propio: solo ve sus clientes y
              notas.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
