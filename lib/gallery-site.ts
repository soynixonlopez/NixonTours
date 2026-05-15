import type { SiteSettingsRow } from "@/types/database";
import { parseGallery } from "@/types/database";

/** Enlaces https públicos guardados en `site_settings` (p. ej. Storage de Supabase). */
export function getSiteGalleryImageUrls(settings: SiteSettingsRow | null): string[] {
  if (!settings) return [];
  return parseGallery(settings.gallery_image_urls)
    .map((s) => s.trim())
    .filter((u) => /^https?:\/\//i.test(u));
}
