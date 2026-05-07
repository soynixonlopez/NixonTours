import Link from "next/link";
import { ArrowRight, Package, MapPin, MessageSquareQuote } from "lucide-react";
import { StatsCard } from "@/components/admin/stats-card";
import { getAdminStats, getQuotesAdmin } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AdminDashboardPage() {
  const [stats, quotes] = await Promise.all([getAdminStats(), getQuotesAdmin()]);
  const recent = quotes.slice(0, 6);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-brand-deep">Dashboard</h1>
        <p className="text-sm text-slate-600">Resumen de actividad Nixon Tours.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard title="Cotizaciones" value={stats.quotesCount} />
        <StatsCard title="Paquetes activos" value={stats.activePackagesCount} />
        <StatsCard title="Islas registradas" value={stats.islandsCount} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Button asChild variant="outline" className="h-auto justify-between py-4">
          <Link href="/admin/cotizaciones" className="flex w-full items-center gap-3">
            <MessageSquareQuote className="h-5 w-5 text-brand-turquoise" />
            Cotizaciones
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto justify-between py-4">
          <Link href="/admin/paquetes" className="flex w-full items-center gap-3">
            <Package className="h-5 w-5 text-brand-aqua" />
            Paquetes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto justify-between py-4">
          <Link href="/admin/islas" className="flex w-full items-center gap-3">
            <MapPin className="h-5 w-5 text-brand-sunset" />
            Islas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold font-display text-brand-deep">Cotizaciones recientes</h2>
          <Button asChild size="sm" variant="ghost">
            <Link href="/admin/cotizaciones">Ver todas</Link>
          </Button>
        </div>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Isla</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha viaje</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500">
                    Sin cotizaciones aún.
                  </TableCell>
                </TableRow>
              ) : (
                recent.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.full_name}</TableCell>
                    <TableCell>{q.islands?.name ?? "—"}</TableCell>
                    <TableCell>{q.package_type ?? "—"}</TableCell>
                    <TableCell>{q.travel_date ?? "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={q.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
