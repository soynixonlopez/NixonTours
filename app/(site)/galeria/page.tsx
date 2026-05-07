import type { Metadata } from "next";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { getActiveIslands } from "@/lib/data";
import { parseGallery } from "@/types/database";

export const metadata: Metadata = {
  title: "Galería Guna Yala",
  description:
    "Imágenes de nuestras islas: Naranjo Chico, Diablo, Perro Chico y más en San Blas.",
};

export default async function GaleriaPage() {
  const islands = await getActiveIslands();
  const hasImages = islands.some(
    (i) =>
      Boolean(i.main_image_url) || parseGallery(i.gallery).length > 0
  );

  return (
    <div className="bg-[#F8FAFC] pb-24 pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-[#0f172a]">Galería</h1>
        <p className="mt-3 max-w-2xl text-lg text-[#475569]">
          Colores del Caribe panameño, organizados por isla. ¿Quieres aparecer aquí?
          Envíanos tus fotos tras tu viaje.
        </p>
        <div className="mt-12">
          {!hasImages ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-600">
              Sube imágenes desde el panel admin para activar esta galería.
            </p>
          ) : (
            <GalleryGrid islands={islands} />
          )}
        </div>
      </div>
    </div>
  );
}
