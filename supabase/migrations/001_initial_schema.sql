-- Nixon Tours — schema, RLS, storage, seed
-- Run in Supabase SQL Editor or via CLI.

create extension if not exists "pgcrypto";

-- ─── Tables ───────────────────────────────────────────────────────────

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  whatsapp text default '+50768252312',
  email text,
  instagram text,
  facebook text,
  address text,
  logo_url text,
  hero_title text default 'Vive Guna Yala con una experiencia auténtica, segura y familiar',
  hero_subtitle text default 'Paquetes de estadía, pasadía y camping hacia las mejores islas de Guna Yala.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.islands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  main_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  island_id uuid not null references public.islands (id) on delete cascade,
  name text not null,
  slug text not null,
  type text not null check (type in ('estadia', 'pasadia', 'camping')),
  price numeric(10, 2) not null,
  duration text,
  short_description text,
  long_description text,
  includes text,
  excludes text,
  itinerary text,
  recommendations text,
  policies text,
  main_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug)
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  whatsapp text not null,
  email text,
  nationality text,
  island_id uuid references public.islands (id) on delete set null,
  package_id uuid references public.packages (id) on delete set null,
  package_type text check (package_type is null or package_type in ('estadia', 'pasadia', 'camping')),
  travel_date date,
  adults integer not null default 1,
  children integer not null default 0,
  needs_transport boolean not null default false,
  comments text,
  status text not null default 'nueva' check (status in ('nueva', 'contactado', 'reservado', 'cancelado')),
  created_at timestamptz not null default now()
);

-- ─── updated_at ───────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tr_islands_updated on public.islands;
create trigger tr_islands_updated
  before update on public.islands
  for each row execute procedure public.set_updated_at();

drop trigger if exists tr_packages_updated on public.packages;
create trigger tr_packages_updated
  before update on public.packages
  for each row execute procedure public.set_updated_at();

drop trigger if exists tr_site_settings_updated on public.site_settings;
create trigger tr_site_settings_updated
  before update on public.site_settings
  for each row execute procedure public.set_updated_at();

-- ─── RLS ──────────────────────────────────────────────────────────────

alter table public.site_settings enable row level security;
alter table public.islands enable row level security;
alter table public.packages enable row level security;
alter table public.quotes enable row level security;

-- Site settings: público puede leer; escribe solo autenticado
drop policy if exists "site_settings_select_public" on public.site_settings;
create policy "site_settings_select_public"
  on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "site_settings_all_authenticated" on public.site_settings;
create policy "site_settings_all_authenticated"
  on public.site_settings for all to authenticated using (true) with check (true);

-- Islands / packages: público ve activos; admin ve y edita todo
drop policy if exists "islands_select_public" on public.islands;
create policy "islands_select_public"
  on public.islands for select to anon, authenticated
  using (is_active = true);

drop policy if exists "islands_select_admin" on public.islands;
create policy "islands_select_admin"
  on public.islands for select to authenticated using (true);

drop policy if exists "islands_write_admin" on public.islands;
create policy "islands_write_admin"
  on public.islands for insert to authenticated with check (true);

drop policy if exists "islands_update_admin" on public.islands;
create policy "islands_update_admin"
  on public.islands for update to authenticated using (true) with check (true);

drop policy if exists "islands_delete_admin" on public.islands;
create policy "islands_delete_admin"
  on public.islands for delete to authenticated using (true);

drop policy if exists "packages_select_public" on public.packages;
create policy "packages_select_public"
  on public.packages for select to anon, authenticated
  using (is_active = true);

drop policy if exists "packages_select_admin" on public.packages;
create policy "packages_select_admin"
  on public.packages for select to authenticated using (true);

drop policy if exists "packages_write_admin" on public.packages;
create policy "packages_write_admin"
  on public.packages for insert to authenticated with check (true);

drop policy if exists "packages_update_admin" on public.packages;
create policy "packages_update_admin"
  on public.packages for update to authenticated using (true) with check (true);

drop policy if exists "packages_delete_admin" on public.packages;
create policy "packages_delete_admin"
  on public.packages for delete to authenticated using (true);

-- Quotes: insert público; gestión autenticada
drop policy if exists "quotes_insert_public" on public.quotes;
create policy "quotes_insert_public"
  on public.quotes for insert to anon, authenticated
  with check (true);

drop policy if exists "quotes_all_authenticated" on public.quotes;
create policy "quotes_all_authenticated"
  on public.quotes for all to authenticated using (true) with check (true);

-- ─── Storage ───────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects for select to public using (bucket_id = 'media');

drop policy if exists "media_auth_upload" on storage.objects;
create policy "media_auth_upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

drop policy if exists "media_auth_update" on storage.objects;
create policy "media_auth_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'media') with check (bucket_id = 'media');

drop policy if exists "media_auth_delete" on storage.objects;
create policy "media_auth_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media');

-- ─── Seed (idempotent por slug) ───────────────────────────────────────

insert into public.site_settings (whatsapp, email, instagram, facebook, address, hero_title, hero_subtitle)
select
  '+50768252312',
  'info@nixontours.com',
  'https://instagram.com/nixontours',
  'https://facebook.com/nixontours',
  'Panamá — salidas hacia Guna Yala',
  'Vive Guna Yala con una experiencia auténtica, segura y familiar',
  'Paquetes de estadía, pasadía y camping hacia las mejores islas de Guna Yala.'
where not exists (select 1 from public.site_settings limit 1);

insert into public.islands (name, slug, description, main_image_url, is_active)
values
  (
    'Isla Naranjo Chico',
    'isla-naranjo-chico',
    'Nuestra isla insignia: arena blanca, aguas turquesa y hospitalidad Guna. Ideal para estadía, pasadía o camping con atención familiar Nixon Tours.',
    null,
    true
  ),
  (
    'Isla Senidub',
    'isla-senidub',
    'Ambiente tranquilo y vistas espectaculares. Perfecta para desconectar y conectar con la cultura Guna.',
    null,
    true
  ),
  (
    'Isla Pelícano',
    'isla-pelicano',
    'Naturaleza vibrante y fondos marinos memorables para snorkelear.',
    null,
    true
  ),
  (
    'Isla Pugsub',
    'isla-pugsub',
    'Experiencia caribeña auténtica con playas vírgenes y relajo premium.',
    null,
    true
  ),
  (
    'Isla Diablo',
    'isla-diablo',
    'Un clásico de Guna Yala: paisajes icónicos y aguas cristalinas.',
    null,
    true
  ),
  (
    'Isla Perro Chico',
    'isla-perro-chico',
    'Famoso por su arena y snorkel. Ideal para familias y parejas.',
    null,
    true
  ),
  (
    'Isla Perro Grande',
    'isla-perro-grande',
    'Espacio amplio, naturaleza y comodidad para vivir Guna Yala a tu ritmo.',
    null,
    true
  )
on conflict (slug) do nothing;

-- Paquetes Isla Naranjo Chico
insert into public.packages (
  island_id, name, slug, type, price, duration, short_description, long_description,
  includes, excludes, itinerary, recommendations, policies, is_active
)
select
  i.id,
  v.name,
  v.slug,
  v.type::text,
  v.price,
  v.duration,
  v.short_description,
  v.long_description,
  v.includes,
  v.excludes,
  v.itinerary,
  v.recommendations,
  v.policies,
  true
from public.islands i
cross join (
  values
    (
      'Estadía — Isla Naranjo Chico',
      'naranjo-chico-estadia',
      'estadia'::text,
      135::numeric,
      '1 noche / opciones extendidas',
      'Hospedaje cómodo, comidas y tiempo para disfrutar la isla.',
      'Vive una estadía completa en nuestra isla insignia con apoyo local de Nixon Tours.',
      'Transporte marítimo coordinado*, comidas, hospedaje en cabaña, uso de instalaciones de playa.',
      'Bebidas alcohólicas, propinas, gastos personales.',
      'Salida coordinada — llegada a la isla — bienvenida y almuerzo — tiempo libre en playa — cena — descanso — desayuno y retorno.',
      'Trae protector solar reef-safe, sombrero y cámara acuática.',
      'Políticas de cancelación según temporada; Nixon Tours te confirma disponibilidad tras tu cotización.'
    ),
    (
      'Pasadía — Isla Naranjo Chico',
      'naranjo-chico-pasadia',
      'pasadia'::text,
      95::numeric,
      'Día completo',
      'Un día tropical con comida incluida y playa privada.',
      'Disfruta Guna Yala en un día: relax, mar y sabores locales.',
      'Transporte marítimo coordinado*, almuerzo típico, tiempo de playa.',
      'Desayuno, cena, bebidas extra.',
      'Salida por la mañana — llegada — bienvenida — playa y snorkel opcional — almuerzo — tarde libre — retorno.',
      'Secador de toalla, traje de baño y repelente ecológico.',
      'Sujeto a clima; reprogramación coordinada con Nixon Tours.'
    ),
    (
      'Camping — Isla Naranjo Chico',
      'naranjo-chico-camping',
      'camping'::text,
      125::numeric,
      '1 noche bajo las estrellas',
      'Camping junto al mar con infraestructura básica y asistencia del equipo.',
      'Experiencia inmersiva con noche en carpa y fogata suave caribeña.',
      'Transporte marítimo coordinado*, carpa, comidas, área asignada.',
      'Equipo personal extra, bebidas alcohólicas.',
      'Llegada — montaje — tarde de playa — cena — fogata opcional — desayuno — retorno.',
      'Luna llena recomendada; consulta por disponibilidad de equipo.',
      'Menores siempre con adulto responsable; Nixon Tours prioriza seguridad.'
    )
) as v(name, slug, type, price, duration, short_description, long_description, includes, excludes, itinerary, recommendations, policies)
where i.slug = 'isla-naranjo-chico'
  and not exists (
    select 1 from public.packages p where p.island_id = i.id and p.slug = v.slug
  );
