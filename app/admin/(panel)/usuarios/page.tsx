import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Usuarios | Admin Nixon Tours",
};

export default function AdminUsuariosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-brand-deep">
          Usuarios
        </h1>
        <p className="text-sm text-slate-600">
          Gestión de cuentas registradas, roles y estado de cliente.
        </p>
      </div>
      <Card className="border-brand-deep/10">
        <CardHeader>
          <CardTitle className="font-display text-lg">Próximamente CRUD completo</CardTitle>
          <CardDescription>
            Aquí conectaremos la tabla{" "}
            <code className="rounded bg-brand-soft px-1 py-0.5 text-xs">profiles</code>{" "}
            con búsqueda, filtros y detalle por usuario (reservas, pagos,
            membresías y afiliación).
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Usa Supabase Dashboard o ejecuta SQL mientras desarrollamos el listado
          en esta pantalla.
        </CardContent>
      </Card>
    </div>
  );
}
