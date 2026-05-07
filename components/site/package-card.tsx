import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildWhatsAppUrl, formatPricePAB, normalizeWhatsAppDigits, packageTypeLabel } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import type { PackageWithIsland } from "@/types/database";
import type { SiteSettingsRow } from "@/types/database";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1583212292450-0c5f344a2d41?auto=format&fit=crop&w=1200&q=80";

export function PackageCard({
  pkg,
  settings,
}: {
  pkg: PackageWithIsland;
  settings: SiteSettingsRow | null;
}) {
  const phone = settings?.whatsapp ?? "+50768252312";
  const islandName = pkg.islands?.name ?? "Guna Yala";
  const img = pkg.main_image_url || pkg.islands?.main_image_url || PLACEHOLDER;
  const wa = buildWhatsAppUrl(
    normalizeWhatsAppDigits(phone),
    `Hola Nixon Tours, quiero cotizar ${packageTypeLabel(pkg.type)} en ${islandName}.`
  );

  return (
    <Card className="group overflow-hidden border-brand-deep/10 transition hover:-translate-y-1 hover:border-brand-turquoise/25 hover:shadow-xl hover:shadow-brand-turquoise/15">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={img}
          alt={pkg.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/65 to-transparent" />
        <Badge className="absolute left-4 top-4 border border-brand-turquoise/20 bg-brand-pearl/95 text-brand-deep shadow-md">
          {packageTypeLabel(pkg.type)}
        </Badge>
      </div>
      <CardContent className="space-y-2 pt-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-brand-turquoise" />
          <span>{islandName}</span>
        </div>
        <h3 className="font-display text-lg font-semibold text-brand-deep">
          {pkg.name}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-600">
          {pkg.short_description}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
          <span className="text-xl font-bold text-brand-deep">
            {formatPricePAB(Number(pkg.price))}
          </span>
          {pkg.duration && (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Clock className="h-4 w-4 text-brand-turquoise" />
              {pkg.duration}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row">
        <Button asChild variant="secondary" className="w-full sm:flex-1">
          <Link href={`/paquetes/${pkg.slug}`}>Ver detalle</Link>
        </Button>
        <WhatsAppButton href={wa} className="w-full sm:flex-1" label="WhatsApp" />
      </CardFooter>
    </Card>
  );
}
