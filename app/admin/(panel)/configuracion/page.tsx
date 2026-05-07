import Link from "next/link";
import { getSiteSettingsAdmin } from "@/lib/admin-data";
import { SettingsForm } from "@/components/admin/settings-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminConfigPage() {
  const settings = await getSiteSettingsAdmin();

  if (!settings) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-slate-600">
          No hay fila en <code className="rounded bg-slate-100 px-1">site_settings</code>.
          Ejecuta el SQL inicial en Supabase y recarga.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-brand-deep">Configuración</h1>
        <p className="text-sm text-slate-600">
          Datos de contacto, redes y textos del hero. El logo debe ser la imagen oficial
          sin alteraciones — súbela aquí y úsala en navbar y footer.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          <Link href="/" className="text-brand-turquoise hover:underline">
            Ver sitio público
          </Link>
        </p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
