import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Información sobre el tratamiento de datos personales en Nixon Tours.",
};

export default function PrivacidadPage() {
  return (
    <div className="bg-brand-soft pb-24 pt-10">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold text-brand-deep">
          Política de privacidad
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-slate-600">
          En Nixon Tours respetamos tu privacidad. Los datos que nos proporciones por
          formularios de contacto, cotización o al crear una cuenta se utilizan únicamente
          para responder a tus consultas, coordinar tus viajes y, en su caso, gestionar tu
          relación contractual con nuestra agencia.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Podrás solicitar acceso, rectificación o eliminación de tus datos conforme a la
          normativa aplicable en Panamá contactándonos por los medios indicados en el sitio web.
          Este texto puede ampliarse con el detalle legal que defina tu asesoría; sustituye o
          complementa este borrador según tu operación real.
        </p>
      </div>
    </div>
  );
}
