import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BookingCard } from "@/components/account/booking-card";
import { fetchBookingsForUser } from "@/lib/data/account-data";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Mis viajes" };

export default async function MisViajesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const bookings = await fetchBookingsForUser(user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-deep">Mis viajes</h1>
          <p className="mt-1 text-sm text-slate-600">Próximo viaje e historial de reservas.</p>
        </div>
        <Button asChild>
          <Link href="/cotizar">Nueva cotización</Link>
        </Button>
      </div>
      {bookings.length === 0 ? (
        <p className="text-sm text-slate-600">
          Aún no hay reservas asociadas. Cuando Nixon Tours registre tu reserva aparecerá aquí.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              pkgLabel={b.packages?.name ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
