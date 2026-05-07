import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { QuoteForm } from "@/components/forms/quote-form";
import { getActiveIslands, getSiteSettings } from "@/lib/data";
import { buildWhatsAppUrl, normalizeWhatsAppDigits } from "@/lib/whatsapp";
import { getAffiliateRefCookie } from "@/lib/ref";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "WhatsApp, email y formulario de contacto Nixon Tours. Tours a Guna Yala y San Blas.",
};

const faqs = [
  {
    q: "¿Incluye transporte desde Ciudad de Panamá?",
    a: "Coordinamos opciones según tu paquete. Indica en la cotización si necesitas transporte.",
  },
  {
    q: "¿Qué debo llevar?",
    a: "Traje de baño, protección solar reef-safe, toalla ligera y efectivo pequeño para consumos locales.",
  },
  {
    q: "¿Puedo viajar con niños?",
    a: "Sí, familia es parte de nuestra esencia. Ajustamos recomendaciones por edades.",
  },
  {
    q: "¿Cómo confirmo una reserva?",
    a: "Tras cotizar, te contactamos por WhatsApp para fechas, cupos y políticas aplicables.",
  },
];

export default async function ContactoPage() {
  const [islands, settings, affiliateCode] = await Promise.all([
    getActiveIslands(),
    getSiteSettings(),
    getAffiliateRefCookie(),
  ]);
  const phone = settings?.whatsapp ?? "+50768252312";
  const wa = buildWhatsAppUrl(
    normalizeWhatsAppDigits(phone),
    "Hola Nixon Tours, tengo una consulta general."
  );

  return (
    <div className="bg-brand-soft pb-24 pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold font-display text-brand-deep">Contacto</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Escríbenos con confianza. Te respondemos lo antes posible para armar tu
          salida a Guna Yala.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Canales directos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl bg-[#10B981] px-4 py-3 text-center font-semibold text-white transition hover:bg-[#0ea271]"
              >
                WhatsApp: {phone}
              </a>
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 text-slate-600 hover:text-brand-turquoise"
                >
                  <Mail className="h-4 w-4" />
                  {settings.email}
                </a>
              )}
              {settings?.instagram && (
                <p>
                  Instagram:{" "}
                  <a
                    href={settings.instagram}
                    className="font-medium text-brand-turquoise underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {settings.instagram}
                  </a>
                </p>
              )}
              {settings?.facebook && (
                <p>
                  Facebook:{" "}
                  <a
                    href={settings.facebook}
                    className="font-medium text-brand-turquoise underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver página
                  </a>
                </p>
              )}
              {settings?.address && (
                <p className="flex gap-2 text-slate-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-turquoise" />
                  {settings.address}
                </p>
              )}
              <p className="text-xs text-slate-500">
                Para cotización completa con isla y tipo de paquete, usa{" "}
                <Link href="/cotizar" className="font-medium text-brand-turquoise underline">
                  Cotizar
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Mensaje rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <QuoteForm
                islands={islands}
                settings={settings}
                requireTripDetails={false}
                affiliateCode={affiliateCode}
              />
            </CardContent>
          </Card>
        </div>

        <section className="mt-16 rounded-3xl border border-brand-deep/10 bg-gradient-to-br from-brand-deep via-brand-deep/95 to-brand-turquoise/80 p-8 text-brand-pearl shadow-xl shadow-brand-deep/20">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Ubicación general</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                Operamos salidas hacia Guna Yala desde Panamá. La logística exacta
                te la confirmamos al coordinar tu fecha.
              </p>
            </div>
            <MapPin className="h-12 w-12 text-[#F4C542]" aria-hidden />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold font-display text-brand-deep">Preguntas frecuentes</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <summary className="cursor-pointer list-none font-semibold font-display text-brand-deep">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
