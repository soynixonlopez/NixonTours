export type PackageType = "estadia" | "pasadia" | "camping";
export type QuoteStatus = "nueva" | "contactado" | "reservado" | "cancelado";

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
