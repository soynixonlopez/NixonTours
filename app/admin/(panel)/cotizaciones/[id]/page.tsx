import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuoteAdmin, getSiteSettingsAdmin } from "@/lib/admin-data";
import { QuoteDetailActions } from "@/components/admin/quote-detail-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/status-badge";
import { packageTypeLabel } from "@/lib/whatsapp";

type Props = { params: Promise<{ id: string }> };

export default async function AdminCotizacionDetailPage({ params }: Props) {
  const { id } = await params;
  const [quote, settings] = await Promise.all([
    getQuoteAdmin(id),
    getSiteSettingsAdmin(),
  ]);
  if (!quote) notFound();

  const phone = settings?.whatsapp ?? "+50768252312";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/cotizaciones"
            className="text-xs font-medium text-brand-turquoise hover:underline"
          >
            ← Cotizaciones
          </Link>
          <h1 className="mt-2 text-2xl font-extrabold font-display text-brand-deep">{quote.full_name}</h1>
          <p className="mt-1 text-sm text-slate-600">
            Creada {new Date(quote.created_at).toLocaleString("es-PA")}
          </p>
        </div>
        <StatusBadge status={quote.status} className="self-start" />
      </div>

      <QuoteDetailActions quote={quote} settingsPhone={phone} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-slate-500">WhatsApp:</span> {quote.whatsapp}
            </p>
            <p>
              <span className="text-slate-500">Email:</span> {quote.email ?? "—"}
            </p>
            <p>
              <span className="text-slate-500">Nacionalidad:</span>{" "}
              {quote.nationality ?? "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Viaje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-slate-500">Isla:</span> {quote.islands?.name ?? "—"}
            </p>
            <p>
              <span className="text-slate-500">Paquete:</span> {quote.packages?.name ?? "—"}
            </p>
            <p>
              <span className="text-slate-500">Tipo:</span>{" "}
              {quote.package_type ? packageTypeLabel(quote.package_type) : "—"}
            </p>
            <p>
              <span className="text-slate-500">Fecha:</span> {quote.travel_date ?? "—"}
            </p>
            <p>
              <span className="text-slate-500">Adultos / Niños:</span> {quote.adults} /{" "}
              {quote.children}
            </p>
            <p>
              <span className="text-slate-500">Carro / transporte terrestre:</span>{" "}
              {quote.needs_transport ? "Sí" : "No"}
            </p>
          </CardContent>
        </Card>
      </div>
      {quote.comments && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comentarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm text-slate-600">{quote.comments}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
