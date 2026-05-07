import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { fetchMembershipForUser } from "@/lib/data/account-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Nixon Premium Club" };

export default async function MiCuentaPremiumPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const m = await fetchMembershipForUser(user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-brand-deep">Nixon Premium Club</h1>
        <p className="mt-2 text-sm text-slate-600">
          Ofertas anticipadas, atención prioritaria y recompensas por viajes frecuentes.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        Estado actual:
        <Badge>{m?.status ?? "Sin membresía activa"}</Badge>
      </div>
      {m?.status !== "active" && (
        <div className="rounded-2xl border border-brand-sunset/30 bg-brand-sand/40 p-6">
          <p className="text-sm text-brand-deep">
            Activa Nixon Premium mediante pago mensual o anual. El equipo valida cada comprobante antes de habilitar beneficios —{" "}
            <strong>tú controlas evidencia</strong>, nosotros la verificación.
          </p>
          <Button asChild className="mt-4">
            <Link href="/premium">Ver planes y beneficios</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
