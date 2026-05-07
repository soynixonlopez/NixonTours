import { notFound } from "next/navigation";
import { getIslandAdminById } from "@/lib/admin-data";
import { IslandForm } from "@/components/admin/island-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditarIslaPage({ params }: Props) {
  const { id } = await params;
  const initial = await getIslandAdminById(id);
  if (!initial) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0f172a]">Editar isla</h1>
        <p className="text-sm text-slate-600">{initial.name}</p>
      </div>
      <IslandForm initial={initial} />
    </div>
  );
}
