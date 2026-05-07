import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/quote-form";
import { getActiveIslands, getSiteSettings } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Cotizar viaje a Guna Yala",
  description:
    "Formulario de cotización Nixon Tours: isla, paquete, fechas y transporte.",
};

export default async function CotizarPage() {
  const [islands, settings] = await Promise.all([
    getActiveIslands(),
    getSiteSettings(),
  ]);

  return (
    <div className="bg-[#F8FAFC] pb-24 pt-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-[#0f172a]">Cotizar mi viaje</h1>
        <p className="mt-3 text-lg text-[#475569]">
          Completa el formulario y te contactamos. También podrás abrir WhatsApp con
          tu mensaje ya redactado.
        </p>
        <Card className="mt-10 border-slate-200">
          <CardHeader>
            <CardTitle>Datos del viaje</CardTitle>
          </CardHeader>
          <CardContent>
            <QuoteForm islands={islands} settings={settings} requireTripDetails />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
