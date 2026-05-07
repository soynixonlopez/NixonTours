import Link from "next/link";
import type { BookingRow } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PaymentProgress } from "@/components/account/payment-progress";

/** Fecha corta ES */
function df(d: string | null) {
  if (!d) return "Por definir";
  try {
    return new Intl.DateTimeFormat("es-PA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(`${d}T12:00:00`));
  } catch {
    return d;
  }
}

export function BookingCard({
  booking,
  pkgLabel,
}: {
  booking: BookingRow;
  pkgLabel: string | null;
}) {
  const statusLabel: Record<BookingRow["status"], string> = {
    pendiente: "Pendiente",
    abonado: "Abonado",
    pagado: "Pagado",
    confirmado: "Confirmado",
    completado: "Completado",
    cancelado: "Cancelado",
  };

  return (
    <Card className="overflow-hidden border-brand-deep/10">
      <CardContent className="space-y-4 pt-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-turquoise">
              Reserva
            </p>
            <h3 className="font-display text-lg font-bold text-brand-deep">
              {pkgLabel ?? "Paquete"}
            </h3>
            <p className="text-sm text-slate-600">{df(booking.travel_date)}</p>
          </div>
          <Badge>{statusLabel[booking.status] ?? booking.status}</Badge>
        </div>
        <p className="text-sm text-slate-600">
          {booking.adults} adulto(s)
          {booking.children ? ` · ${booking.children} niño(s)` : ""}
        </p>
        <PaymentProgress
          paid={Number(booking.amount_paid)}
          total={Number(booking.total_amount)}
        />
      </CardContent>
      <CardFooter className="border-t border-brand-deep/5 pt-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/mi-cuenta/pagos">Ver pagos</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
