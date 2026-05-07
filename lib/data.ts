import type { IslandRow, PackageWithIsland, SiteSettingsRow } from "@/types/database";
import { createClient } from "@/lib/supabase/server";

function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.length &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length
  );
}

export async function getSiteSettings(): Promise<SiteSettingsRow | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as SiteSettingsRow;
}

export async function getActiveIslands(): Promise<IslandRow[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("islands")
    .select("*")
    .eq("is_active", true)
    .order("name");
  if (error || !data) return [];
  return data as IslandRow[];
}

export async function getIslandBySlug(slug: string): Promise<IslandRow | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("islands")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error || !data) return null;
  return data as IslandRow;
}

export async function getAllIslandsAdmin(): Promise<IslandRow[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("islands")
    .select("*")
    .order("name");
  if (error || !data) return [];
  return data as IslandRow[];
}

export async function getActivePackages(): Promise<PackageWithIsland[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select(
      `*,
      islands ( id, name, slug, main_image_url )`
    )
    .eq("is_active", true)
    .order("price");
  if (error || !data) return [];
  return data as PackageWithIsland[];
}

export async function getPackageBySlug(slug: string): Promise<PackageWithIsland | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select(
      `*,
      islands ( id, name, slug, main_image_url, description )`
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error || !data) return null;
  return data as PackageWithIsland;
}

export async function getPackagesForIsland(islandId: string): Promise<PackageWithIsland[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select(
      `*,
      islands ( id, name, slug, main_image_url )`
    )
    .eq("island_id", islandId)
    .eq("is_active", true)
    .order("price");
  if (error || !data) return [];
  return data as PackageWithIsland[];
}
