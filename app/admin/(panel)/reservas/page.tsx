import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reservas | Admin Nixon Tours",
};

export default function AdminReservasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-brand-deep">
          Reservas
        </h1>
        <p className="text-sm text-slate-600">
          Abonos, estados de reserva y vínculos con código de afiliado.
        </p>
      </div>
      <Card className="border-brand-deep/10">
        <CardHeader>
          <CardTitle className="font-display text-lg">
            Gestión centralizada en construcción
          </CardTitle>
          <CardDescription>
            Se listarán reservas con estados pendiente · abonado · pagado ·
            confirmado · completado · cancelado, montos abonados y saldo pendiente.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Los cambios desde admin crearán registros relacionados en{" "}
          <code className="rounded bg-brand-soft px-1 py-0.5 text-xs">
            bookings
          </code>{" "}
          alineados con RLS solo para admins.
        </CardContent>
      </Card>
    </div>
  );
}
