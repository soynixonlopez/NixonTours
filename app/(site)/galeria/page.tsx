import type { Metadata } from "next";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { getSiteSettings, getActiveIslands } from "@/lib/data";
import { getSiteGalleryImageUrls } from "@/lib/gallery-site";
import { parseGallery } from "@/types/database";

export const metadata: Metadata = {
  title: "Galería Guna Yala",
  description:
    "Imágenes de nuestras islas: Naranjo Chico, Diablo, Perro Chico y más en San Blas.",
};

export const revalidate = 120;

export default async function GaleriaPage() {
  const [settings, islands] = await Promise.all([
    getSiteSettings(),
    getActiveIslands(),
  ]);

  const featuredGalleryUrls = getSiteGalleryImageUrls(settings);

  const hasIslandImages = islands.some(
    (i) => Boolean(i.main_image_url) || parseGallery(i.gallery).length > 0
  );
  const showEmpty = featuredGalleryUrls.length === 0 && !hasIslandImages;

  return (
    <div className="bg-[#F8FAFC] pb-24 pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold font-display text-brand-deep">Galería</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Las fotos destacadas las definís pegando enlaces públicos (<span className="font-medium">https://…</span>) en{" "}
          <strong className="font-semibold text-brand-deep/90">Admin → Configuración</strong>. Debajo aparecen también
          las imágenes que tengas cargadas por isla.
        </p>
        <div className="mt-12">
          {showEmpty ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-600">
              Todavía no hay enlaces en configuración ni fotos por isla. Abrí Administración → Configuración y pegá una
              URL por línea (por ejemplo desde el bucket público media en Supabase).
            </p>
          ) : (
            <GalleryGrid islands={islands} featuredImageUrls={featuredGalleryUrls} />
          )}
        </div>
      </div>
    </div>
  );
}
