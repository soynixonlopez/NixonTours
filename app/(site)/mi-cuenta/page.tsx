import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BookingCard } from "@/components/account/booking-card";
import { Button } from "@/components/ui/button";
import {
  fetchAffiliateForUser,
  fetchBookingsForUser,
  fetchMembershipForUser,
  fetchQuotesForUser,
  fetchUnreadNotifications,
} from "@/lib/data/account-data";
import { getProfile } from "@/lib/auth/session";
import { buildWhatsAppUrl, normalizeWhatsAppDigits } from "@/lib/whatsapp";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Resumen" };

export default async function MiCuentaHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profile, settings, bookings, quotes, membership, affiliate, unread] =
    await Promise.all([
      getProfile(user.id),
      getSiteSettings(),
      fetchBookingsForUser(user.id),
      fetchQuotesForUser(user.id),
      fetchMembershipForUser(user.id),
      fetchAffiliateForUser(user.id),
      fetchUnreadNotifications(user.id, 6),
    ]);

  const firstName = profile?.full_name?.split(" ")[0] ?? user.email ?? "Viajero";
  const upcoming = bookings.find(
    (b) => !["cancelado", "completado"].includes(b.status)
  );
  const phone = settings?.whatsapp ?? "+50768252312";
  const wa = buildWhatsAppUrl(
    normalizeWhatsAppDigits(phone),
    `Hola Nixon Tours, soy ${profile?.full_name ?? user.email} y consulto sobre mi cuenta.`
  );

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-turquoise">
          Nixon Portal del viajero
        </p>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-brand-deep sm:text-3xl">
          Hola, {firstName}
        </h1>
        <p className="mt-2 text-slate-600">
          Próximo viaje, cotizaciones, beneficios Nixon Premium y tu código de socio en un solo lugar.
        </p>
      </div>

      {unread.length > 0 && (
        <div className="rounded-2xl border border-brand-turquoise/25 bg-brand-soft/80 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-brand-deep">Alertas recientes</p>
          <ul className="mt-2 space-y-1">
            {unread.map((n) => (
              <li key={n.id} className="text-sm text-slate-700">
                <span className="font-semibold text-brand-deep">{n.title}</span> — {n.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-deep/10 bg-gradient-to-br from-brand-soft to-brand-pearl p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-brand-deep">Tu próxima aventura</h2>
          {upcoming ? (
            <div className="mt-4">
              <BookingCard
                booking={upcoming}
                pkgLabel={upcoming.packages?.name ?? null}
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">
              Aún no hay una reserva activa visible. Solicita cotización para que nuestro equipo la convierta en reserva oficial.
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/cotizar">Cotizar</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/mi-cuenta/mis-viajes">Mis viajes</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={wa} target="_blank" rel="noreferrer">
                WhatsApp
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-brand-deep/10 p-6">
          <h2 className="font-display text-lg font-bold text-brand-deep">Tu estado</h2>
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between rounded-xl bg-brand-soft/80 px-3 py-2">
              <dt className="text-slate-600">Cotizaciones</dt>
              <dd className="font-semibold text-brand-deep">{quotes.length}</dd>
            </div>
            <div className="flex justify-between rounded-xl bg-brand-soft/80 px-3 py-2">
              <dt className="text-slate-600">Membresía premium</dt>
              <dd className="font-semibold text-brand-turquoise">
                {membership?.status === "active"
                  ? "Activa"
                  : membership?.status ?? "Sin plan"}
              </dd>
            </div>
            <div className="flex justify-between rounded-xl bg-brand-soft/80 px-3 py-2">
              <dt className="text-slate-600">Nixon Partner</dt>
              <dd className="font-semibold text-brand-deep">
                {affiliate?.status === "approved"
                  ? affiliate.affiliate_code
                  : affiliate?.status === "pending"
                    ? "Pendiente"
                    : "Disponible"}
              </dd>
            </div>
          </dl>
          <Button asChild variant="outline" className="mt-4 w-full sm:w-auto">
            <Link href="/premium">Explorar Nixon Premium Club</Link>
          </Button>
          <Button asChild variant="ghost" className="block w-full sm:w-auto">
            <Link href="/afiliados">Invita y gana · Afiliados</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
