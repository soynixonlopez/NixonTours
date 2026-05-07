import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nixon Premium Club · Membresía",
};

export default function LandingPremiumPage() {
  const benefits = [
    "Early access a nuevas rutas isleñas",
    "Descuentos selectos Nixon Tours",
    "Prioridad de coordinación WhatsApp",
    "Contenido exclusivo sobre cultura Guna",
    "Recompensas para viajes frecuentes",
  ];

  return (
    <div>
      <section className="border-b border-brand-deep/10 bg-gradient-brand py-20 text-brand-pearl">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Sparkles className="mx-auto h-10 w-10 text-brand-sunset" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-brand-aqua">
            Nixon Premium Club
          </p>
          <h1 className="mt-5 font-display text-4xl font-extrabold sm:text-5xl">
            Viaja Guna Yala con tratamiento insider
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-brand-pearl/85">
            Membresía mensual o anual. Pagos por Yappy o transferencia validados manualmente por nuestro equipo —{" "}
            <span className="font-semibold">sin cargos automatizados sorpresa</span>.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" size="lg" className="border-brand-pearl/40 bg-brand-pearl/10 text-brand-pearl">
              <Link href="/registro">Crear cuenta y activar después</Link>
            </Button>
            <Button asChild size="lg" className="bg-brand-pearl text-brand-deep hover:bg-brand-sand">
              <Link href="/login?next=/mi-cuenta/premium">Ya tengo cuenta · Continuar</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:grid-cols-2 sm:px-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-deep">Beneficios</h2>
          <ul className="mt-6 space-y-3 text-slate-600">
            {benefits.map((b) => (
              <li key={b} className="rounded-xl bg-brand-soft/80 px-4 py-3 text-sm">
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-brand-deep/10 bg-brand-pearl p-8 shadow-lg">
          <h2 className="font-display text-2xl font-bold text-brand-deep">Normal vs Premium</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between border-b border-brand-deep/10 pb-3">
              <dt className="text-slate-500">Usuario web</dt>
              <dd className="font-semibold text-brand-deep">Cotiza y espera disponibilidad</dd>
            </div>
            <div className="flex justify-between border-b border-brand-deep/10 pb-3">
              <dt className="text-slate-500">Premium Nixon</dt>
              <dd className="font-semibold text-brand-turquoise">Cola prioritaria · ofertas flash</dd>
            </div>
          </dl>
          <p className="mt-8 text-xs text-slate-500">
            Los planes aparecerán en tu panel cuando el equipo active la pasarela de comprobantes. Montos referencia según temporada.
          </p>
          <Link href="/afiliados" className="mt-6 inline-flex text-sm font-semibold text-brand-turquoise underline">
            ¿Ganas recomendando? Conoce Nixon Partner Program
          </Link>
        </div>
      </section>
    </div>
  );
}
