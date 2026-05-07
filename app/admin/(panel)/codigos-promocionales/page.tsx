import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Códigos promocionales | Admin Nixon Tours",
};

export default function AdminCodigosPromocionalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-brand-deep">
          Códigos promocionales
        </h1>
        <p className="text-sm text-slate-600">
          Códigos por afiliado, vigencia y descuentos parametrizados.
        </p>
      </div>
      <Card className="border-brand-deep/10">
        <CardHeader>
          <CardTitle className="font-display text-lg">
            Alta y desactivación
          </CardTitle>
          <CardDescription>
            Conectar con{" "}
            <code className="rounded bg-brand-soft px-1 py-0.5 text-xs">
              promo_codes
            </code>
            ; enlaces públicos siguen formato{" "}
            <code className="rounded bg-brand-soft px-1 py-0.5 text-xs">
              /paquetes?ref=CODIGO
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Relacionar código con afiliado y auditar uso en cotizaciones y
          reservas cuando el flujo de compra confirme el cliente.
        </CardContent>
      </Card>
    </div>
  );
}
