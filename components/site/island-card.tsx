import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { IslandRow } from "@/types/database";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80";

export function IslandCard({ island }: { island: IslandRow }) {
  const img = island.main_image_url || PLACEHOLDER;
  return (
    <Card className="overflow-hidden transition hover:shadow-lg">
      <div className="relative aspect-[4/3]">
        <Image
          src={img}
          alt={island.name}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>
      <CardContent className="pt-5">
        <h3 className="text-lg font-semibold text-[#0f172a]">{island.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-[#475569]">
          {island.description ?? "Descubre esta joya de Guna Yala con Nixon Tours."}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="group w-full justify-between px-0 hover:bg-transparent">
          <Link href={`/islas/${island.slug}`} className="flex w-full items-center justify-between">
            Ver isla
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
