import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍳</span>
            <span className="text-xl font-semibold text-text">
              Alumia
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pt-24 pb-16 text-center">
          <span className="inline-block rounded-full bg-primary-light px-4 py-1.5 text-sm font-medium text-primary">
            Para emprendedoras Essen
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-text md:text-5xl lg:text-6xl">
            Organizá tus clientes
            <br />
            <span className="text-primary">y hacé crecer tu negocio</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
            Un CRM simple y hermoso para gestionar tus contactos, hacer
            seguimiento y nunca perder una venta.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40"
            >
              Quiero probarlo gratis
            </Link>
            <Link
              href="/login"
              className="rounded-xl border-2 border-border bg-white px-8 py-3.5 text-base font-semibold text-text transition-colors hover:border-primary hover:text-primary"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-8 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-text">
                Tus clientes organizados
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                Guardá nombre, teléfono, email y medio de pago. Todo en un solo
                lugar.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-8 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary-light">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-text">
                Notas y seguimiento
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                Anotá "contactar a fin de mes" o cualquier recordatorio para no
                olvidarte.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-8 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-success-light">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-text">
                WhatsApp directo
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                Contactá a tus clientes con un clic. Mensajes pre-armados para
                ahorrar tiempo.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl font-bold text-text">
              ¿Para quién es esta herramienta?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              Para revendedoras Essen que quieren llevar el control de sus
              clientes de forma profesional. También apto para cualquier
              emprendedora que venda productos por catálogo.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="rounded-full bg-primary-light px-4 py-2 text-sm font-medium text-primary">
                Revendedoras Essen
              </span>
              <span className="rounded-full bg-secondary-light px-4 py-2 text-sm font-medium text-secondary">
                Emprendedoras
              </span>
              <span className="rounded-full bg-success-light px-4 py-2 text-sm font-medium text-success">
                Equipos de ventas
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-text">
            ¿Lista para empezar?
          </h2>
          <p className="mt-2 text-text-secondary">
            Crea tu cuenta gratis y empezá a organizar tus clientes hoy mismo.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark"
          >
            Crear mi cuenta gratis
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-text-secondary">
        <p>Hecho con 💕 para emprendedoras</p>
      </footer>
    </div>
  );
}
