-- Nixon Tours — clientes premium, reservas, pagos, membresías, afiliados.
-- Ejecutar después de 001_initial_schema.sql
-- IMPORTANTE: Tras migrar, marca al menos un usuario admin:
--   UPDATE public.profiles SET role = 'admin' WHERE email = 'tu@email.com';

-- ─── Perfiles (ligado a auth.users) ──────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text,
  email text,
  nationality text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_profiles_updated on public.profiles;
create trigger tr_profiles_updated
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'Viajero'),
    'customer'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.profiles (id, email, full_name, role)
select
  u.id,
  coalesce(u.email, ''),
  coalesce(u.raw_user_meta_data->>'full_name', split_part(coalesce(u.email, 'user@local'), '@', 1)),
  'customer'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- ─── Extensión quotes ───────────────────────────────────────────────────

alter table public.quotes add column if not exists user_id uuid references auth.users (id) on delete set null;
alter table public.quotes add column if not exists affiliate_code text;
create index if not exists idx_quotes_user_id on public.quotes (user_id);

-- ─── Reservas y pagos ───────────────────────────────────────────────────

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  package_id uuid references public.packages (id) on delete set null,
  island_id uuid references public.islands (id) on delete set null,
  travel_date date,
  adults integer not null default 1,
  children integer not null default 0,
  total_amount numeric(12, 2) not null default 0,
  amount_paid numeric(12, 2) not null default 0,
  balance_due numeric(12, 2) generated always as (total_amount - amount_paid) stored,
  status text not null default 'pendiente'
    check (status in ('pendiente', 'abonado', 'pagado', 'confirmado', 'completado', 'cancelado')),
  payment_method text,
  affiliate_code text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_bookings_updated on public.bookings;
create trigger tr_bookings_updated
  before update on public.bookings
  for each row execute procedure public.set_updated_at();

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  booking_id uuid references public.bookings (id) on delete cascade,
  amount numeric(12, 2) not null,
  payment_method text not null default 'manual',
  proof_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_payments_updated on public.payments;
create trigger tr_payments_updated
  before update on public.payments
  for each row execute procedure public.set_updated_at();

-- ─── Membresías ────────────────────────────────────────────────────────

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_name text not null,
  price numeric(12, 2) not null,
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly', 'yearly')),
  start_date date,
  end_date date,
  status text not null default 'pending'
    check (status in ('active', 'expired', 'cancelled', 'pending')),
  proof_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_memberships_updated on public.memberships;
create trigger tr_memberships_updated
  before update on public.memberships
  for each row execute procedure public.set_updated_at();

-- ─── Afiliados ─────────────────────────────────────────────────────────

create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  affiliate_code text not null unique,
  commission_rate numeric(5, 2) not null default 10.00 check (commission_rate >= 0 and commission_rate <= 100),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'suspended')),
  total_clicks integer not null default 0,
  total_conversions integer not null default 0,
  total_earned numeric(12, 2) not null default 0,
  total_paid numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

drop trigger if exists tr_affiliates_updated on public.affiliates;
create trigger tr_affiliates_updated
  before update on public.affiliates
  for each row execute procedure public.set_updated_at();

create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid references public.affiliates (id) on delete cascade,
  affiliate_code text not null,
  visitor_ip text,
  user_agent text,
  landing_page text,
  created_at timestamptz not null default now()
);

create table if not exists public.affiliate_referrals (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates (id) on delete cascade,
  referred_user_id uuid references auth.users (id) on delete set null,
  quote_id uuid references public.quotes (id) on delete set null,
  booking_id uuid references public.bookings (id) on delete set null,
  affiliate_code text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates (id) on delete cascade,
  booking_id uuid references public.bookings (id) on delete set null,
  amount_base numeric(12, 2) not null,
  commission_rate numeric(5, 2) not null,
  commission_amount numeric(12, 2) not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'paid', 'cancelled')),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_commissions_updated on public.commissions;
create trigger tr_commissions_updated
  before update on public.commissions
  for each row execute procedure public.set_updated_at();

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  affiliate_id uuid references public.affiliates (id) on delete set null,
  discount_type text not null default 'percent' check (discount_type in ('percent', 'fixed')),
  discount_value numeric(12, 2) not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- ─── Favoritos y notificaciones ────────────────────────────────────────

create table if not exists public.favorite_packages (
  user_id uuid not null references auth.users (id) on delete cascade,
  package_id uuid not null references public.packages (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, package_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user on public.notifications (user_id, created_at desc);

-- ─── Helper RLS: admin ────────────────────────────────────────────────

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.role = 'admin' from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin() to anon;

-- ─── RLS profiles ──────────────────────────────────────────────────────

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (
    id = auth.uid()
    or public.is_admin()
  );

drop policy if exists "profiles_insert_admin_only" on public.profiles;
-- Perfiles creados por trigger; no insert manual desde cliente
create policy "profiles_insert_admin_only"
  on public.profiles for insert to authenticated
  with check (public.is_admin());

-- ─── RLS bookings, payments, memberships ─────────────────────────────

alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.memberships enable row level security;
alter table public.favorite_packages enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "bookings_select_own_or_admin" on public.bookings;
create policy "bookings_select_own_or_admin"
  on public.bookings for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "bookings_insert_own_or_admin" on public.bookings;
create policy "bookings_insert_own_or_admin"
  on public.bookings for insert to authenticated
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "bookings_update_own_or_admin" on public.bookings;
create policy "bookings_update_own_or_admin"
  on public.bookings for update to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "payments_select_own_or_admin" on public.payments;
create policy "payments_select_own_or_admin"
  on public.payments for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "payments_insert_own" on public.payments;
create policy "payments_insert_own"
  on public.payments for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "payments_update_admin" on public.payments;
create policy "payments_update_admin"
  on public.payments for update to authenticated
  using (public.is_admin());

drop policy if exists "memberships_select_own_or_admin" on public.memberships;
create policy "memberships_select_own_or_admin"
  on public.memberships for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "memberships_insert_own" on public.memberships;
create policy "memberships_insert_own"
  on public.memberships for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "memberships_update_admin" on public.memberships;
create policy "memberships_update_admin"
  on public.memberships for update to authenticated
  using (public.is_admin());

drop policy if exists "favorites_all_own" on public.favorite_packages;

drop policy if exists "favorites_select_own" on public.favorite_packages;
create policy "favorites_select_own"
  on public.favorite_packages for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "favorites_insert_own" on public.favorite_packages;
create policy "favorites_insert_own"
  on public.favorite_packages for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "favorites_delete_own" on public.favorite_packages;
create policy "favorites_delete_own"
  on public.favorite_packages for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own"
  on public.notifications for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "notifications_update_own_or_admin" on public.notifications;
create policy "notifications_update_own_or_admin"
  on public.notifications for update to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "notifications_insert_admin" on public.notifications;
create policy "notifications_insert_admin"
  on public.notifications for insert to authenticated
  with check (public.is_admin());

-- ─── RLS affiliates ecosystem ──────────────────────────────────────────

alter table public.affiliates enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.affiliate_referrals enable row level security;
alter table public.commissions enable row level security;
alter table public.promo_codes enable row level security;

drop policy if exists "affiliates_select_own_or_admin" on public.affiliates;
create policy "affiliates_select_own_or_admin"
  on public.affiliates for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "affiliates_insert_own" on public.affiliates;
create policy "affiliates_insert_own"
  on public.affiliates for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "affiliates_update_admin" on public.affiliates;
create policy "affiliates_update_admin"
  on public.affiliates for update to authenticated
  using (public.is_admin());

drop policy if exists "affiliates_update_own_pending" on public.affiliates;
create policy "affiliates_update_own_pending"
  on public.affiliates for update to authenticated
  using (user_id = auth.uid() and status = 'pending')
  with check (user_id = auth.uid());

drop policy if exists "affiliate_clicks_admin" on public.affiliate_clicks;
create policy "affiliate_clicks_admin"
  on public.affiliate_clicks for select to authenticated
  using (public.is_admin());

drop policy if exists "affiliate_clicks_insert_public" on public.affiliate_clicks;
create policy "affiliate_clicks_insert_public"
  on public.affiliate_clicks for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.affiliates a
      where a.status = 'approved'
        and upper(a.affiliate_code) = upper(affiliate_clicks.affiliate_code)
    )
  );

drop policy if exists "referrals_admin" on public.affiliate_referrals;
create policy "referrals_admin"
  on public.affiliate_referrals for select to authenticated
  using (
    public.is_admin()
    or exists (select 1 from public.affiliates af where af.id = affiliate_referrals.affiliate_id and af.user_id = auth.uid())
  );

drop policy if exists "referrals_insert_system" on public.affiliate_referrals;
drop policy if exists "referrals_insert_admin" on public.affiliate_referrals;
create policy "referrals_insert_admin"
  on public.affiliate_referrals for insert to authenticated
  with check (public.is_admin());

drop policy if exists "commissions_affiliate_read" on public.commissions;
create policy "commissions_affiliate_read"
  on public.commissions for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.affiliates af where af.id = commissions.affiliate_id and af.user_id = auth.uid()
    )
  );

drop policy if exists "commissions_admin_write" on public.commissions;
create policy "commissions_admin_write"
  on public.commissions for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "promo_select_active" on public.promo_codes;
create policy "promo_select_active"
  on public.promo_codes for select to anon, authenticated
  using (is_active = true and (expires_at is null or expires_at > now()));

drop policy if exists "promo_admin_all" on public.promo_codes;
create policy "promo_admin_all"
  on public.promo_codes for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ─── Quotes: policies más restrictivas ─────────────────────────────────

drop policy if exists "quotes_all_authenticated" on public.quotes;

drop policy if exists "quotes_select_own_or_admin" on public.quotes;
create policy "quotes_select_own_or_admin"
  on public.quotes for select to authenticated
  using (
    public.is_admin()
    or (user_id is not null and user_id = auth.uid())
  );

drop policy if exists "quotes_update_admin" on public.quotes;
create policy "quotes_update_admin"
  on public.quotes for update to authenticated
  using (public.is_admin());

drop policy if exists "quotes_delete_admin" on public.quotes;
create policy "quotes_delete_admin"
  on public.quotes for delete to authenticated
  using (public.is_admin());

-- ─── Storage: comprobantes ─────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

drop policy if exists "proofs_read_own_or_admin" on storage.objects;
create policy "proofs_read_own_or_admin"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'payment-proofs'
    and (
      public.is_admin()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );

drop policy if exists "proofs_upload_own" on storage.objects;
create policy "proofs_upload_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "proofs_update_own_or_admin" on storage.objects;
create policy "proofs_update_own_or_admin"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'payment-proofs'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );

drop policy if exists "proofs_delete_admin" on storage.objects;
create policy "proofs_delete_admin"
  on storage.objects for delete to authenticated
  using (bucket_id = 'payment-proofs' and public.is_admin());
