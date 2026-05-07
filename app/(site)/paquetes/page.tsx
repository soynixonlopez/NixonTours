import type { Metadata } from "next";
import { PackagesExplorer } from "@/components/site/packages-explorer";
import { getActivePackages, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Paquetes Guna Yala",
  description:
    "Filtra estadía, pasadía y camping por isla y precio. Paquetes Nixon Tours a San Blas / Guna Yala.",
};

export default async function PaquetesPage() {
  const [packages, settings] = await Promise.all([
    getActivePackages(),
    getSiteSettings(),
  ]);

  return (
    <div className="bg-[#F8FAFC] pb-20 pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
          Catálogo
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#0f172a]">
          Paquetes turísticos
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[#475569]">
          Estadías, pasadías y camping diseñados para que disfrutes Guna Yala sin
          complicaciones. Cotiza y te respondemos con disponibilidad.
        </p>
        <div className="mt-12">
          <PackagesExplorer packages={packages} settings={settings} />
        </div>
      </div>
    </div>
  );
}
