import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pagos | Admin Nixon Tours",
};

export default function AdminPagosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-brand-deep">
          Pagos
        </h1>
        <p className="text-sm text-slate-600">
          Comprobantes Yappy / transferencia, aprobación o rechazo manual.
        </p>
      </div>
      <Card className="border-brand-deep/10">
        <CardHeader>
          <CardTitle className="font-display text-lg">
            Tabla de comprobantes pendientes
          </CardTitle>
          <CardDescription>
            Aquí se integrará vista previa de archivos del bucket{" "}
            <code className="rounded bg-brand-soft px-1 py-0.5 text-xs">
              payment-proofs
            </code>
            , notas internas y acciones rápidas aprobado/rechazado.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Nunca se marcarán pagos como aprobados de forma automática; solo desde
          panel admin tras revisión.
        </CardContent>
      </Card>
    </div>
  );
}
