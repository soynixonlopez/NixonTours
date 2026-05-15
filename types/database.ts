export type PackageType = "estadia" | "pasadia" | "camping";
export type QuoteStatus = "nueva" | "contactado" | "reservado" | "cancelado";

export type UserRole = "customer" | "admin";

export type BookingStatus =
  | "pendiente"
  | "abonado"
  | "pagado"
  | "confirmado"
  | "completado"
  | "cancelado";

export type PaymentProofStatus = "pending" | "approved" | "rejected";

export type MembershipStatus = "active" | "expired" | "cancelled" | "pending";

export type AffiliateStatus = "pending" | "approved" | "rejected" | "suspended";

export type CommissionStatus = "pending" | "approved" | "paid" | "cancelled";

export interface ProfileRow {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  nationality: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface BookingRow {
  id: string;
  user_id: string;
  package_id: string | null;
  island_id: string | null;
  travel_date: string | null;
  adults: number;
  children: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  status: BookingStatus;
  payment_method: string | null;
  affiliate_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRow {
  id: string;
  user_id: string;
  booking_id: string | null;
  amount: number;
  payment_method: string;
  proof_url: string | null;
  status: PaymentProofStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MembershipRow {
  id: string;
  user_id: string;
  plan_name: string;
  price: number;
  billing_cycle: "monthly" | "yearly";
  start_date: string | null;
  end_date: string | null;
  status: MembershipStatus;
  proof_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AffiliateRow {
  id: string;
  user_id: string;
  affiliate_code: string;
  commission_rate: number;
  status: AffiliateStatus;
  total_clicks: number;
  total_conversions: number;
  total_earned: number;
  total_paid: number;
  created_at: string;
  updated_at: string;
}

export interface CommissionRow {
  id: string;
  affiliate_id: string;
  booking_id: string | null;
  amount_base: number;
  commission_rate: number;
  commission_amount: number;
  status: CommissionStatus;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface IslandRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  main_image_url: string | null;
  gallery: unknown;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PackageRow {
  id: string;
  island_id: string;
  name: string;
  slug: string;
  type: PackageType;
  price: number;
  duration: string | null;
  short_description: string | null;
  long_description: string | null;
  includes: string | null;
  excludes: string | null;
  itinerary: string | null;
  recommendations: string | null;
  policies: string | null;
  main_image_url: string | null;
  gallery: unknown;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuoteRow {
  id: string;
  full_name: string;
  whatsapp: string;
  email: string | null;
  nationality: string | null;
  island_id: string | null;
  package_id: string | null;
  package_type: PackageType | null;
  travel_date: string | null;
  adults: number;
  children: number;
  needs_transport: boolean;
  comments: string | null;
  status: QuoteStatus;
  user_id: string | null;
  affiliate_code: string | null;
  created_at: string;
}

export interface SiteSettingsRow {
  id: string;
  whatsapp: string;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  address: string | null;
  logo_url: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  /** URLs https de imágenes para /galería y el bloque “Galería visual” del inicio */
  gallery_image_urls?: unknown;
  created_at: string;
  updated_at: string;
}

export interface PackageWithIsland extends PackageRow {
  islands: Pick<IslandRow, "id" | "name" | "slug" | "main_image_url"> | null;
}

export function parseGallery(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((x): x is string => typeof x === "string");
  }
  return [];
}
