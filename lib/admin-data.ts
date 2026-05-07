import { createClient } from "@/lib/supabase/server";
import type {
  IslandRow,
  PackageRow,
  PackageWithIsland,
  QuoteRow,
  SiteSettingsRow,
} from "@/types/database";

export type QuoteWithRelations = QuoteRow & {
  islands: { name: string } | null;
  packages: { name: string } | null;
};

export async function getQuotesAdmin(): Promise<QuoteWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select(`*, islands ( name ), packages ( name )`)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as QuoteWithRelations[];
}

export async function getQuoteAdmin(id: string): Promise<QuoteWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select(`*, islands ( name ), packages ( name )`)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as QuoteWithRelations;
}

export async function getPackagesAdmin(): Promise<PackageWithIsland[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select(`*, islands ( id, name, slug, main_image_url )`)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as PackageWithIsland[];
}

export async function getPackageAdminById(id: string): Promise<PackageRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("packages").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return data as PackageRow;
}

export async function getIslandsAdmin(): Promise<IslandRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("islands").select("*").order("name");
  if (error || !data) return [];
  return data as IslandRow[];
}

export async function getIslandAdminById(id: string): Promise<IslandRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("islands").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return data as IslandRow;
}

export async function getSiteSettingsAdmin(): Promise<SiteSettingsRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as SiteSettingsRow;
}

export async function getAdminStats() {
  const supabase = await createClient();
  const [quotes, packages, islands] = await Promise.all([
    supabase.from("quotes").select("id", { count: "exact", head: true }),
    supabase.from("packages").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("islands").select("id", { count: "exact", head: true }),
  ]);
  return {
    quotesCount: quotes.count ?? 0,
    activePackagesCount: packages.count ?? 0,
    islandsCount: islands.count ?? 0,
  };
}
