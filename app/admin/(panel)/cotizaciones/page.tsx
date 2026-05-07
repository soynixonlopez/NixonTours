import Link from "next/link";
import { getQuotesAdmin } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { packageTypeLabel } from "@/lib/whatsapp";

export default async function AdminCotizacionesPage() {
  const quotes = await getQuotesAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-brand-deep">Cotizaciones</h1>
        <p className="text-sm text-slate-600">
          Gestiona solicitudes y actualiza el estado del embudo.
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Isla</TableHead>
            <TableHead>Paquete</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Fecha viaje</TableHead>
            <TableHead>Personas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-slate-500">
                Sin cotizaciones.
              </TableCell>
            </TableRow>
          ) : (
            quotes.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/admin/cotizaciones/${q.id}`}
                    className="text-brand-deep hover:underline"
                  >
                    {q.full_name}
                  </Link>
                </TableCell>
                <TableCell>{q.whatsapp}</TableCell>
                <TableCell>{q.email ?? "—"}</TableCell>
                <TableCell>{q.islands?.name ?? "—"}</TableCell>
                <TableCell>{q.packages?.name ?? "—"}</TableCell>
                <TableCell>
                  {q.package_type ? packageTypeLabel(q.package_type) : "—"}
                </TableCell>
                <TableCell>{q.travel_date ?? "—"}</TableCell>
                <TableCell>
                  {q.adults}A / {q.children}N
                </TableCell>
                <TableCell>
                  <StatusBadge status={q.status} />
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-slate-500">
                  {new Date(q.created_at).toLocaleString("es-PA")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
