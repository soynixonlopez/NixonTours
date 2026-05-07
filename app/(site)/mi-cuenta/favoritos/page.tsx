import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PackageCard } from "@/components/site/package-card";
import { getSiteSettings } from "@/lib/data";
import type { PackageWithIsland } from "@/types/database";

export const metadata: Metadata = { title: "Favoritos" };

type FavoritePackageJoin = {
  package_id: string;
  packages: PackageWithIsland | null;
};

export default async function FavoritosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rowsRaw } = await supabase
    .from("favorite_packages")
    .select(
      `
      package_id,
      packages (
        *,
        islands ( id, name, slug, main_image_url )
      )
    `
    )
    .eq("user_id", user.id);

  const rows = rowsRaw as FavoritePackageJoin[] | null;
  const settings = await getSiteSettings();
  const list = (rows ?? [])
    .map((r) => r.packages)
    .filter((pkg): pkg is PackageWithIsland => pkg != null);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-extrabold text-brand-deep">Paquetes favoritos</h1>
      <p className="text-sm text-slate-600">
        Tus paquetes guardados para decidir rápido antes de cotizar de nuevo.
      </p>
      {list.length === 0 ? (
        <p className="text-sm text-slate-600">
          Aún no tienes favoritos. Pronto podrás marcar desde cada ficha de paquete.
          <Link href="/paquetes" className="ml-1 font-semibold text-brand-turquoise underline">
            Explorar paquetes
          </Link>
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {list.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} settings={settings} />
          ))}
        </div>
      )}
    </div>
  );
}
