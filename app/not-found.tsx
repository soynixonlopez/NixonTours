import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
        404
      </p>
      <h1 className="mt-3 text-3xl font-extrabold text-[#0f172a]">
        Página no encontrada
      </h1>
      <p className="mt-3 max-w-md text-[#475569]">
        La ruta no existe o el contenido fue movido. Vuelve al inicio o cotiza tu
        viaje.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/cotizar">Cotizar mi viaje</Link>
        </Button>
      </div>
    </div>
  );
}
