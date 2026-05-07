import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, X, ListOrdered, Lightbulb, FileWarning } from "lucide-react";
import { QuoteForm } from "@/components/forms/quote-form";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getActiveIslands,
  getPackageBySlug,
  getSiteSettings,
} from "@/lib/data";
import { buildWhatsAppUrl, formatPricePAB, normalizeWhatsAppDigits, packageTypeLabel } from "@/lib/whatsapp";
import { parseGallery } from "@/types/database";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1583212292450-0c5f344a2d41?auto=format&fit=crop&w=1600&q=80";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return { title: "Paquete" };
  return {
    title: pkg.name,
    description: pkg.short_description ?? `Paquete ${packageTypeLabel(pkg.type)} en Guna Yala con Nixon Tours.`,
  };
}

export default async function PaqueteDetailPage({ params }: Props) {
  const { slug } = await params;
  const [pkg, islands, settings] = await Promise.all([
    getPackageBySlug(slug),
    getActiveIslands(),
    getSiteSettings(),
  ]);

  if (!pkg) notFound();

  const islandName = pkg.islands?.name ?? "Guna Yala";
  const phone = settings?.whatsapp ?? "+50768252312";
  const wa = buildWhatsAppUrl(
    normalizeWhatsAppDigits(phone),
    `Hola Nixon Tours, quiero información del paquete: ${pkg.name}.`
  );

  const main = pkg.main_image_url || pkg.islands?.main_image_url || PLACEHOLDER;
  const galleryThumbs = parseGallery(pkg.gallery)
    .filter((u) => u !== main)
    .slice(0, 6);

  const blocks = [
    { icon: Check, title: "Incluye", text: pkg.includes },
    { icon: X, title: "No incluye", text: pkg.excludes },
    { icon: ListOrdered, title: "Itinerario", text: pkg.itinerary },
    { icon: Lightbulb, title: "Recomendaciones", text: pkg.recommendations },
    { icon: FileWarning, title: "Políticas", text: pkg.policies },
  ];

  return (
    <div className="bg-[#F8FAFC] pb-24 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-slate-500">
          <Link href="/paquetes" className="hover:text-cyan-600">
            Paquetes
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{pkg.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={main}
                alt={pkg.name}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
                priority
              />
            </div>
            {galleryThumbs.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {galleryThumbs.map((url, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                    <Image src={url} alt="" fill className="object-cover" sizes="120px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Badge>{packageTypeLabel(pkg.type)}</Badge>
            <h1 className="mt-3 text-3xl font-extrabold text-[#0f172a] sm:text-4xl">
              {pkg.name}
            </h1>
            <p className="mt-2 text-slate-600">{islandName}</p>
            <p className="mt-2 text-4xl font-bold text-[#1e3a5f]">
              {formatPricePAB(Number(pkg.price))}{" "}
              <span className="text-base font-medium text-slate-500">/ persona</span>
            </p>
            {pkg.duration && (
              <p className="mt-2 text-sm text-slate-600">Duración: {pkg.duration}</p>
            )}
            <p className="mt-6 text-lg leading-relaxed text-[#475569]">
              {pkg.long_description || pkg.short_description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="#cotizar">Cotizar este paquete</Link>
              </Button>
              <WhatsAppButton href={wa} size="lg" label="WhatsApp" />
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {blocks
            .filter((b) => b.text)
            .map((b) => (
              <Card key={b.title} className="border-slate-200/90">
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                  <b.icon className="h-5 w-5 text-cyan-600" />
                  <CardTitle className="text-base">{b.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-[#475569]">
                    {b.text}
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>

        <section id="cotizar" className="mt-20 scroll-mt-28">
          <h2 className="text-2xl font-bold text-[#0f172a]">Cotizar</h2>
          <p className="mt-2 text-[#475569]">
            Completa el formulario o escríbenos por WhatsApp con un clic.
          </p>
          <Card className="mt-6 border-slate-200">
            <CardContent className="pt-6">
              <QuoteForm
                islands={islands}
                settings={settings}
                defaultIslandId={pkg.island_id}
                defaultPackageId={pkg.id}
                defaultPackageType={pkg.type}
                packageName={pkg.name}
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
