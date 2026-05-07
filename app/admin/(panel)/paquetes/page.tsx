import Link from "next/link";
import { Plus } from "lucide-react";
import { getPackagesAdmin } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { packageTypeLabel } from "@/lib/whatsapp";
import { formatPricePAB } from "@/lib/whatsapp";
import { DeletePackageButton } from "@/components/admin/delete-package-button";
import { TogglePackageActiveButton } from "@/components/admin/toggle-package-button";

export default async function AdminPaquetesPage() {
  const packages = await getPackagesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a]">Paquetes</h1>
          <p className="text-sm text-slate-600">Crea, edita y controla visibilidad.</p>
        </div>
        <Button asChild>
          <Link href="/admin/paquetes/nuevo" className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo paquete
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Isla</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Activo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-slate-500">
                Sin paquetes. Crea el primero.
              </TableCell>
            </TableRow>
          ) : (
            packages.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.islands?.name ?? "—"}</TableCell>
                <TableCell>{packageTypeLabel(p.type)}</TableCell>
                <TableCell>{formatPricePAB(Number(p.price))}</TableCell>
                <TableCell>{p.is_active ? "Sí" : "No"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/admin/paquetes/${p.id}/editar`}>Editar</Link>
                    </Button>
                    <TogglePackageActiveButton id={p.id} isActive={p.is_active} />
                    <DeletePackageButton id={p.id} />
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
