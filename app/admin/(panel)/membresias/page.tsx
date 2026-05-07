import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Membresías | Admin Nixon Tours",
};

export default function AdminMembresiasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-brand-deep">
          Membresías
        </h1>
        <p className="text-sm text-slate-600">
          Nixon Premium Club · planes mensuales y anuales.
        </p>
      </div>
      <Card className="border-brand-deep/10">
        <CardHeader>
          <CardTitle className="font-display text-lg">
            Activar o cancelar suscripciones
          </CardTitle>
          <CardDescription>
            Se mostrará cada fila en{" "}
            <code className="rounded bg-brand-soft px-1 py-0.5 text-xs">
              memberships
            </code>{" "}
            con fechas de inicio/fin y comprobantes.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Estados esperados: activo, vencido, cancelado, pendiente — alineados
          con beneficios comunicados en /premium.
        </CardContent>
      </Card>
    </div>
  );
}
