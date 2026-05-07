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
    <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:border-brand-turquoise/20 hover:shadow-lg hover:shadow-brand-turquoise/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={img}
          alt={island.name}
          fill
          className="object-cover transition duration-500 hover:scale-[1.02]"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>
      <CardContent className="pt-5">
        <h3 className="font-display text-lg font-semibold text-brand-deep">
          {island.name}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-600">
          {island.description ?? "Descubre esta joya de Guna Yala con Nixon Tours."}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          variant="ghost"
          className="group w-full justify-between px-1 hover:bg-transparent hover:text-brand-turquoise"
        >
          <Link
            href={`/islas/${island.slug}`}
            className="flex w-full items-center justify-between"
          >
            Ver isla
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
