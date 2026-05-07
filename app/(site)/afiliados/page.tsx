import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nixon Partner Program · Afiliados",
};

export default function LandingAfiliadosPage() {
  return (
    <div>
      <section className="border-b border-brand-deep/10 bg-brand-deep py-20 text-brand-pearl">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Users className="mx-auto h-10 w-10 text-brand-aqua" />
          <h1 className="mt-8 font-display text-4xl font-extrabold sm:text-[2.65rem]">
            Gana comisiones recomendando Guna Yala
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-brand-pearl/80">
            Códigos únicos y enlaces con <code className="rounded bg-brand-pearl/10 px-1">?ref=</code>. Comisiones del{" "}
            <strong>10%–15%</strong> cuando Nixon Tours confirma y marca la reserva como pagada.
          </p>
          <Button asChild className="mt-10 bg-brand-pearl text-brand-deep hover:bg-brand-sand" size="lg">
            <Link href="/login?next=/mi-cuenta/afiliado">Quiero mi código</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-brand-deep">Cómo funciona</h2>
        <ol className="list-decimal space-y-4 pl-5 text-slate-600">
          <li>Creas tu cuenta Nixon Tours.</li>
          <li>Pides tu código en Nixon Partner (estado Pendiente).</li>
          <li>Un admin aprueba y te entrega el link público tipo /paquetes?ref=TUCODIGO.</li>
          <li>Un turista reserva · paga · Nixon valida pagos manualmente · se generan comisiones pendientes hasta pago aliado.</li>
        </ol>
        <div className="rounded-2xl border border-brand-deep/10 bg-brand-soft p-6 text-sm text-slate-700">
          <strong>Ejemplo:</strong> Paquete $135 con tasa del 15% ⇒ comisión $20.25 marcada Pendiente hasta aprobación y pago Nixon Partner.
        </div>
      </section>
    </div>
  );
}
