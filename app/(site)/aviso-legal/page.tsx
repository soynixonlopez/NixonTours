import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Condiciones generales y aviso legal de Nixon Tours.",
};

export default function AvisoLegalPage() {
  return (
    <div className="bg-brand-soft pb-24 pt-10">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold text-brand-deep">
          Aviso legal
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-slate-600">
          El contenido de este sitio web tiene carácter informativo. Nixon Tours se esfuerza
          por mantener la información actualizada, sin garantizar la ausencia de errores u
          omisiones. Las condiciones de los servicios turísticos (precios, disponibilidad,
          itinerarios) se confirman al contratar o cotizar de forma expresa con nuestro equipo.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Los enlaces a terceros son meramente orientativos. Sustituye este borrador por el
          texto revisado por tu asesor legal con los datos fiscales, domicilio social y
          condiciones de uso definitivas de tu agencia.
        </p>
      </div>
    </div>
  );
}
