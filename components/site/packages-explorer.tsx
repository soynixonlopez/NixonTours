"use client";

import { useMemo, useState } from "react";
import { PackageCard } from "@/components/site/package-card";
import type { PackageWithIsland } from "@/types/database";
import type { SiteSettingsRow } from "@/types/database";
import { packageTypeLabel } from "@/lib/whatsapp";
import { SelectNative } from "@/components/ui/select-native";
import { Label } from "@/components/ui/label";

export function PackagesExplorer({
  packages,
  settings,
}: {
  packages: PackageWithIsland[];
  settings: SiteSettingsRow | null;
}) {
  const islands = useMemo(() => {
    const m = new Map<string, string>();
    packages.forEach((p) => {
      if (p.islands?.id && p.islands.name) m.set(p.islands.id, p.islands.name);
    });
    return Array.from(m.entries()).map(([id, name]) => ({ id, name }));
  }, [packages]);

  const maxPkgPrice = useMemo(
    () => Math.max(0, ...packages.map((p) => Number(p.price))),
    [packages]
  );

  const [type, setType] = useState<string>("");
  const [islandId, setIslandId] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(() =>
    maxPkgPrice > 0 ? Math.ceil(maxPkgPrice / 5) * 5 : 500
  );

  const filtered = packages.filter((p) => {
    if (type && p.type !== type) return false;
    if (islandId && p.island_id !== islandId) return false;
    if (Number(p.price) > maxPrice) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-2xl border border-brand-deep/10 bg-brand-pearl p-4 shadow-md shadow-brand-deep/5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label>Tipo de paquete</Label>
          <SelectNative value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Todos</option>
            <option value="estadia">{packageTypeLabel("estadia")}</option>
            <option value="pasadia">{packageTypeLabel("pasadia")}</option>
            <option value="camping">{packageTypeLabel("camping")}</option>
          </SelectNative>
        </div>
        <div className="space-y-2">
          <Label>Isla</Label>
          <SelectNative
            value={islandId}
            onChange={(e) => setIslandId(e.target.value)}
          >
            <option value="">Todas</option>
            {islands.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </SelectNative>
        </div>
        <div className="space-y-2 sm:col-span-2 lg:col-span-2">
          <Label htmlFor="price-range">
            Precio máximo: ${maxPrice} / persona
          </Label>
          <input
            id="price-range"
            type="range"
            min={50}
            max={Math.max(200, Math.ceil(maxPkgPrice / 25) * 25)}
            step={5}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-brand-turquoise"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand-turquoise/30 bg-brand-soft p-10 text-center text-sm text-slate-600">
          No hay paquetes con estos filtros. Ajusta tipo, isla o precio.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PackageCard key={p.id} pkg={p} settings={settings} />
          ))}
        </div>
      )}
    </div>
  );
}
