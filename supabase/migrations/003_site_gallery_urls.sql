-- URLs públicas de la galería principal (pegar enlaces https, p. ej. Supabase Storage u otro CDN).
alter table public.site_settings
  add column if not exists gallery_image_urls jsonb not null default '[]'::jsonb;
