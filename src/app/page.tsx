import Link from "next/link";

const WHATSAPP_NUMBER = "541123456789";
const WHATSAPP_MSG = encodeURIComponent("Hola! Quiero info sobre Alumia");

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-background to-background">
      <header className="border-b border-border/60 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark text-sm font-bold text-white shadow-sm">
              A
            </div>
            <span className="text-lg font-semibold text-text">Alumia</span>
          </div>
          <Link
            href="/login"
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-light px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Para emprendedoras
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-text md:text-5xl lg:text-6xl">
            Organizá tus clientes
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              y hacé crecer tu negocio
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
            Una herramienta simple y poderosa para gestionar tus contactos, hacer
            seguimiento y nunca perder una venta.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-success to-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-success/30 transition-all hover:brightness-105 hover:shadow-xl hover:shadow-success/40"
            >
              💬 Quiero información
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border-2 border-border bg-white px-8 py-3.5 text-base font-semibold text-text transition-all hover:border-primary/30 hover:text-primary"
            >
              ✉️ Contactame
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="group animate-slide-up rounded-2xl border border-border bg-white p-8 text-center transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light text-2xl transition-transform group-hover:scale-110">
                👥
              </div>
              <h3 className="text-lg font-semibold text-text">
                Tus contactos organizados
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Guardá toda la información importante de tus clientes en un solo
                lugar, siempre a mano y bien ordenada.
              </p>
            </div>

            <div className="group animate-slide-up rounded-2xl border border-border bg-white p-8 text-center transition-all hover:-translate-y-1 hover:border-secondary/20 hover:shadow-lg hover:shadow-secondary/5 [animation-delay:0.1s]">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary-light text-2xl transition-transform group-hover:scale-110">
                📝
              </div>
              <h3 className="text-lg font-semibold text-text">
                Notas y seguimiento
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Anotá recordatorios, fechas importantes, y nunca te olvides de
                hacer seguimiento a tus clientes.
              </p>
            </div>

            <div className="group animate-slide-up rounded-2xl border border-border bg-white p-8 text-center transition-all hover:-translate-y-1 hover:border-success/20 hover:shadow-lg hover:shadow-success/5 [animation-delay:0.2s]">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-success-light text-2xl transition-transform group-hover:scale-110">
                💬
              </div>
              <h3 className="text-lg font-semibold text-text">
                WhatsApp directo
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Contactá a tus clientes con un clic. Mensajes pre-armados para
                ahorrar tiempo y vender más.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-border/40 bg-white py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-bold text-text">
              Todo lo que necesitás en un solo lugar
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-text-secondary">
              Olvidate de los papelitos y los contactos perdidos en WhatsApp.
              Llevá el control profesional de tu negocio.
            </p>
            <div className="mt-10 grid gap-4 text-left md:grid-cols-2">
              <div className="flex items-start gap-4 rounded-xl bg-background p-5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-sm">
                  ✓
                </span>
                <div>
                  <p className="font-medium text-text">Base de contactos</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Todos tus clientes con notas para no perder detalle
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl bg-background p-5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success-light text-sm text-success">
                  ✓
                </span>
                <div>
                  <p className="font-medium text-text">WhatsApp integrado</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Contactá a tus clientes con un clic
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl bg-background p-5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-light text-sm text-secondary">
                  ✓
                </span>
                <div>
                  <p className="font-medium text-text">Soporte personalizado</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Te ayudo a configurar todo, sin complicaciones
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl bg-background p-5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-sm">
                  ✓
                </span>
                <div>
                  <p className="font-medium text-text">Fácil de usar</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Sin conocimientos técnicos, intuitive y rápido
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-text">
            ¿Querés saber más?
          </h2>
          <p className="mt-2 text-text-secondary">
            Escribime por WhatsApp y te cuento cómo funciona, los planes
            disponibles y resolvemos todas tus dudas.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-success to-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-success/30 transition-all hover:brightness-105 hover:shadow-xl"
          >
            💬 Consultame por WhatsApp
          </a>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-text-muted">
        <p>
          Alumia © {new Date().getFullYear()} —{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark"
          >
            Contacto
          </a>
        </p>
      </footer>
    </div>
  );
}
