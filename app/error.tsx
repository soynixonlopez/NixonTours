"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-brand-soft px-4 text-center">
      <h1 className="text-2xl font-extrabold font-display text-brand-deep">Algo salió mal</h1>
      <p className="mt-3 max-w-md text-slate-600">
        Ocurrió un error inesperado. Intenta de nuevo o vuelve al inicio.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={() => reset()}>
          Reintentar
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Inicio</Link>
        </Button>
      </div>
    </div>
  );
}
