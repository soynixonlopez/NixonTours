import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { fetchPaymentsForUser, fetchBookingsForUser } from "@/lib/data/account-data";
import { Badge } from "@/components/ui/badge";
import { PaymentProgress } from "@/components/account/payment-progress";

export const metadata: Metadata = { title: "Pagos" };

export default async function PagosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const payments = await fetchPaymentsForUser(user.id);
  const bookings = await fetchBookingsForUser(user.id);
  const lead = bookings.find((b) => !["cancelado", "completado"].includes(b.status));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-extrabold text-brand-deep">Pagos</h1>
      <p className="max-w-xl text-sm text-slate-600">
        Tus abonos y comprobantes bajo revisión Nixon Tours (Yappy, transferencia). El equipo valida antes de aplicar saldo — nunca apruebas automáticamente.
      </p>
      {payments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-deep/15 bg-brand-soft/50 px-4 py-8 text-center text-sm text-slate-600">
          Sin pagos registrados aún.
          <br />
          Cuando hagas tu primer abono aparecerá con estado Pendiente hasta que el equipo lo revise.
          <Link href="/cotizar" className="mt-4 inline-block font-semibold text-brand-turquoise underline">
            Ir a cotización
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {payments.map((p) => (
            <li key={p.id} className="rounded-2xl border border-brand-deep/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-brand-deep">${p.amount.toFixed(2)}</span>
                <Badge>
                  {p.status === "pending"
                    ? "Pendiente"
                    : p.status === "approved"
                      ? "Aprobado"
                      : "Rechazado"}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-slate-500 capitalize">{p.payment_method}</p>
              {p.proof_url && (
                <a
                  href={p.proof_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-brand-turquoise underline"
                >
                  Ver comprobante
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
      {lead ? (
        <div className="max-w-lg">
          <h2 className="mb-2 font-display font-bold text-brand-deep">Reserva en curso</h2>
          <PaymentProgress
            paid={Number(lead.amount_paid)}
            total={Number(lead.total_amount)}
          />
        </div>
      ) : null}
    </div>
  );
}
