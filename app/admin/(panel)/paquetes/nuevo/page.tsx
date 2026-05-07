import { getIslandsAdmin } from "@/lib/admin-data";
import { PackageForm } from "@/components/admin/package-form";

export default async function NuevoPaquetePage() {
  const islands = await getIslandsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0f172a]">Nuevo paquete</h1>
        <p className="text-sm text-slate-600">Slug único (ej. isla-slug-estadia).</p>
      </div>
      <PackageForm islands={islands} />
    </div>
  );
}
