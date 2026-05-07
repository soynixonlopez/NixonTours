import type { Metadata } from "next";
import { Shield, Heart, Globe2, Anchor } from "lucide-react";
import { CTASection } from "@/components/site/cta-section";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nosotros — Agencia familiar en Panamá",
  description:
    "Nixon Tours: más de 5 años transportando turistas a Guna Yala con seguridad, cultura y cercanía familiar.",
};

export default async function NosotrosPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <section className="relative overflow-hidden bg-[#0f172a] py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,212,255,0.2),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/90">
            Nixon Tours
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Historia familiar, experiencia local
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Somos una agencia familiar de turismo en Panamá con más de 5 años de
            experiencia personal transportando turistas nacionales e internacionales
            hacia las mejores islas de Guna Yala. Combinamos conocimiento del
            territorio, logística cuidadosa y atención humana en cada salida.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0f172a]">
              Especialistas en Guna Yala
            </h2>
            <p className="mt-4 text-[#475569]">
              Nuestro enfoque prioriza la seguridad, la confianza y la cultura. Te
              ayudamos a elegir isla y paquete según tu tiempo, presupuesto y
              espíritu de aventura —sin perder el confort ni la claridad en la
              coordinación.
            </p>
            <p className="mt-4 text-[#475569]">
              Atendemos con el mismo cuidado a turistas locales y visitantes del
              exterior. Nixon Tours nace del deseo de compartir el Caribe
              panameño con respeto y calidad de servicio.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              {
                icon: Shield,
                t: "Seguridad primero",
                d: "Operación prudente y comunicación clara antes, durante y después del viaje.",
              },
              {
                icon: Heart,
                t: "Trato cercano",
                d: "Cada cotización la vive una familia que entiende lo que significa confiar.",
              },
              {
                icon: Globe2,
                t: "Cultura Guna",
                d: "Respeto por las comunidades y su territorio —viajar bien es viajar consciente.",
              },
              {
                icon: Anchor,
                t: "Salidas coordinadas",
                d: "Logística pensada para que solo te preocupes por disfrutar.",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <x.icon className="mt-1 h-6 w-6 shrink-0 text-cyan-500" />
                <div>
                  <h3 className="font-semibold text-[#0f172a]">{x.t}</h3>
                  <p className="mt-1 text-sm text-[#475569]">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        settings={settings}
        eyebrow="¿Hablamos?"
        title="Cotiza con Nixon Tours"
        subtitle="Cuéntanos tus fechas y armamos propuesta. Respuesta ágil por WhatsApp."
      />
    </div>
  );
}
