import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { fetchAffiliateForUser } from "@/lib/data/account-data";
import { AffiliateRequestForm } from "@/components/account/affiliate-request-form";
import { ReferralLinkBox } from "@/components/account/referral-link-box";

export const metadata: Metadata = { title: "Afiliado" };

export default async function AfiliadoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const affiliate = await fetchAffiliateForUser(user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-brand-deep">Nixon Partner Program</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Gana comisiones del 10% al 15% por turistas que reserven con tu código. Las comisiones se generan cuando la reserva queda confirmada y pagada (revisión manual Nixon Tours).
        </p>
      </div>

      {!affiliate ? (
        <AffiliateRequestForm />
      ) : affiliate.status === "pending" ? (
        <p className="rounded-2xl border border-brand-sunset/40 bg-brand-sunset/10 px-4 py-3 text-sm text-brand-deep">
          Tu solicitud está en revisión. Te notificaremos cuando el equipo active tu código.
        </p>
      ) : affiliate.status === "rejected" ? (
        <p className="text-sm text-red-700">No fue posible aprobar la solicitud. Contacta a Nixon Tours.</p>
      ) : affiliate.status === "suspended" ? (
        <p className="text-sm text-amber-800">Tu cuenta de socio está suspendida temporalmente.</p>
      ) : (
        <div className="space-y-6">
          <ReferralLinkBox code={affiliate.affiliate_code} />
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-deep/10 bg-brand-soft/60 p-4">
              <dt className="text-xs font-semibold uppercase text-slate-500">Tasa</dt>
              <dd className="mt-1 font-display text-2xl font-bold text-brand-deep">
                {Number(affiliate.commission_rate)}%
              </dd>
            </div>
            <div className="rounded-2xl border border-brand-deep/10 bg-brand-soft/60 p-4">
              <dt className="text-xs font-semibold uppercase text-slate-500">Comisiones acumuladas</dt>
              <dd className="mt-1 font-display text-2xl font-bold text-brand-turquoise">
                ${Number(affiliate.total_earned).toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
