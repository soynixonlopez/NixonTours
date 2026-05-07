import { createClient } from "@/lib/supabase/server";
import type {
  AffiliateRow,
  BookingRow,
  MembershipRow,
  NotificationRow,
  PaymentRow,
  QuoteRow,
} from "@/types/database";

export async function fetchBookingsForUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `*,
      packages ( name, slug, main_image_url ),
      islands ( name, slug )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) console.error(error);
  return (data ?? []) as (BookingRow & {
    packages: { name: string; slug: string; main_image_url: string | null } | null;
    islands: { name: string; slug: string } | null;
  })[];
}

export async function fetchPaymentsForUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) console.error(error);
  return (data ?? []) as PaymentRow[];
}

export async function fetchQuotesForUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) console.error(error);
  return (data ?? []) as QuoteRow[];
}

export async function fetchMembershipForUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) console.error(error);
  return data as MembershipRow | null;
}

export async function fetchAffiliateForUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("affiliates")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) console.error(error);
  return data as AffiliateRow | null;
}

export async function fetchUnreadNotifications(userId: string, limit = 10) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) console.error(error);
  return (data ?? []) as NotificationRow[];
}
