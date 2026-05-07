import { notFound } from "next/navigation";
import { getIslandsAdmin, getPackageAdminById } from "@/lib/admin-data";
import { PackageForm } from "@/components/admin/package-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditarPaquetePage({ params }: Props) {
  const { id } = await params;
  const [initial, islands] = await Promise.all([
    getPackageAdminById(id),
    getIslandsAdmin(),
  ]);
  if (!initial) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0f172a]">Editar paquete</h1>
        <p className="text-sm text-slate-600">{initial.name}</p>
      </div>
      <PackageForm islands={islands} initial={initial} />
    </div>
  );
}
