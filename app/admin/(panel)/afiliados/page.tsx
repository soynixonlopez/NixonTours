import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Afiliados | Admin Nixon Tours",
};

export default function AdminAfiliadosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-brand-deep">
          Afiliados
        </h1>
        <p className="text-sm text-slate-600">
          Nixon Partner Program · aprobación, tasas por afiliado y rendimiento.
        </p>
      </div>
      <Card className="border-brand-deep/10">
        <CardHeader>
          <CardTitle className="font-display text-lg">
            Estado de solicitudes
          </CardTitle>
          <CardDescription>
            Flujo: pendiente → aprobado / rechazado / suspendido. Tipos de
            comisión 10%–15% editables por fila desde admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Las conversiones sólo cuentan con afiliados aprobados y reservas
          confirmadas o pagadas según las reglas de negocio.
        </CardContent>
      </Card>
    </div>
  );
}
