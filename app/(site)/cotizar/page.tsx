import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/quote-form";
import { getActiveIslands, getSiteSettings } from "@/lib/data";
import { getAffiliateRefCookie } from "@/lib/ref";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Cotizar viaje a Guna Yala",
  description:
    "Formulario de cotización Nixon Tours: isla, paquete, fechas y transporte.",
};

export default async function CotizarPage() {
  const [islands, settings, affiliateCode] = await Promise.all([
    getActiveIslands(),
    getSiteSettings(),
    getAffiliateRefCookie(),
  ]);

  return (
    <div className="bg-brand-soft pb-24 pt-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold font-display text-brand-deep">Cotizar mi viaje</h1>
        <p className="mt-3 text-lg text-slate-600">
          Completa el formulario y te contactamos. También podrás abrir WhatsApp con
          tu mensaje ya redactado.
        </p>
        <Card className="mt-10 border-slate-200">
          <CardHeader>
            <CardTitle>Datos del viaje</CardTitle>
          </CardHeader>
          <CardContent>
            <QuoteForm
              islands={islands}
              settings={settings}
              requireTripDetails
              affiliateCode={affiliateCode}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
