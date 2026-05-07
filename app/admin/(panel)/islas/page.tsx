import Link from "next/link";
import { Plus } from "lucide-react";
import { getIslandsAdmin } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteIslandButton } from "@/components/admin/delete-island-button";
import { ToggleIslandActiveButton } from "@/components/admin/toggle-island-button";

export default async function AdminIslasPage() {
  const islands = await getIslandsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a]">Islas</h1>
          <p className="text-sm text-slate-600">Nombre, slug, imágenes y estado.</p>
        </div>
        <Button asChild>
          <Link href="/admin/islas/nueva" className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva isla
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Activa</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {islands.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-slate-500">
                Sin islas.
              </TableCell>
            </TableRow>
          ) : (
            islands.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.name}</TableCell>
                <TableCell className="text-slate-600">{i.slug}</TableCell>
                <TableCell>{i.is_active ? "Sí" : "No"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/admin/islas/${i.id}/editar`}>Editar</Link>
                    </Button>
                    <ToggleIslandActiveButton id={i.id} isActive={i.is_active} />
                    <DeleteIslandButton id={i.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
