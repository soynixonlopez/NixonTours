import type { Metadata } from "next";
import { IslandCard } from "@/components/site/island-card";
import { getActiveIslands } from "@/lib/data";

export const metadata: Metadata = {
  title: "Islas de Guna Yala y San Blas",
  description:
    "Isla Naranjo Chico, Senidub, Pelícano, Pugsub, Diablo, Perro Chico y Perro Grande. Nixon Tours.",
};

export default async function IslasPage() {
  const islands = await getActiveIslands();

  return (
    <div className="bg-[#F8FAFC] pb-24 pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0f172a]">
          Nuestras islas
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[#475569]">
          Tu próxima aventura comienza en una isla paradisíaca. Explora cada
          destino y elige el que mejor encaje contigo.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {islands.length === 0 ? (
            <p className="text-sm text-slate-600">No hay islas activas aún.</p>
          ) : (
            islands.map((i) => <IslandCard key={i.id} island={i} />)
          )}
        </div>
      </div>
    </div>
  );
}
