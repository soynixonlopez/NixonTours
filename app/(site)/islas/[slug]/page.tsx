import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageCard } from "@/components/site/package-card";
import { getIslandBySlug, getPackagesForIsland, getSiteSettings } from "@/lib/data";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const island = await getIslandBySlug(slug);
  if (!island) return { title: "Isla" };
  return {
    title: island.name,
    description:
      island.description ??
      `Paquetes y tours a ${island.name} con Nixon Tours — Guna Yala.`,
  };
}

export default async function IslaDetailPage({ params }: Props) {
  const { slug } = await params;
  const [island, settings] = await Promise.all([
    getIslandBySlug(slug),
    getSiteSettings(),
  ]);
  if (!island) notFound();

  const packages = await getPackagesForIsland(island.id);
  const img = island.main_image_url || PLACEHOLDER;

  return (
    <div className="bg-[#F8FAFC] pb-24 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-slate-500">
          <Link href="/islas" className="hover:text-cyan-600">
            Islas
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{island.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image
              src={img}
              alt={island.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-[#0f172a]">{island.name}</h1>
            <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-[#475569]">
              {island.description}
            </p>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-[#0f172a]">Paquetes disponibles</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {packages.length === 0 ? (
              <p className="text-sm text-slate-600">
                Aún no hay paquetes activos para esta isla.{" "}
                <Link href="/cotizar" className="font-medium text-cyan-600 underline">
                  Cotízanos
                </Link>
                .
              </p>
            ) : (
              packages.map((p) => (
                <PackageCard key={p.id} pkg={p} settings={settings} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
