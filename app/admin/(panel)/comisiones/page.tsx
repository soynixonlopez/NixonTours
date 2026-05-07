import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Comisiones | Admin Nixon Tours",
};

export default function AdminComisionesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-brand-deep">
          Comisiones
        </h1>
        <p className="text-sm text-slate-600">
          Pendientes · aprobadas · pagadas · canceladas.
        </p>
      </div>
      <Card className="border-brand-deep/10">
        <CardHeader>
          <CardTitle className="font-display text-lg">
            Liquide comisiones a afiliados
          </CardTitle>
          <CardDescription>
            Resumen agrupado por afiliado, importes generados desde reservas
            vinculadas y marca de fecha de pago al historial{" "}
            <code className="rounded bg-brand-soft px-1 py-0.5 text-xs">
              commissions.paid_at
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          El cálculo parte del monto base de la venta aplicando la tasa del
          afiliado al momento del cierre.
        </CardContent>
      </Card>
    </div>
  );
}
