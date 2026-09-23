create extension if not exists pgcrypto;

create table if not exists public.hotels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text,
  location text not null,
  address text,
  description text,
  starting_price numeric(12,2) not null default 0 check (starting_price >= 0),
  phone text,
  whatsapp text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_types (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  slug text not null,
  name text not null,
  price_per_night numeric(12,2) not null default 0 check (price_per_night >= 0),
  total_rooms integer not null default 0 check (total_rooms >= 0),
  max_guests integer not null default 1 check (max_guests > 0),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (hotel_id, slug)
);

create table if not exists public.parking_config (
  hotel_id uuid primary key references public.hotels(id) on delete cascade,
  total_slots integer not null default 0 check (total_slots >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text unique,
  hotel_id uuid not null references public.hotels(id),
  room_type_id uuid not null references public.room_types(id),
  guest_name text not null,
  phone text not null,
  email text,
  check_in date not null,
  check_out date not null,
  adults integer not null default 1 check (adults > 0),
  children integer not null default 0 check (children >= 0),
  rooms_count integer not null default 1 check (rooms_count > 0),
  parking_required boolean not null default false,
  vehicle_number text,
  special_requests text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','checked_in','checked_out','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_dates_valid check (check_out > check_in)
);

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','manager')),
  display_name text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists hotels_set_updated_at on public.hotels;
create trigger hotels_set_updated_at before update on public.hotels
for each row execute function public.set_updated_at();

drop trigger if exists room_types_set_updated_at on public.room_types;
create trigger room_types_set_updated_at before update on public.room_types
for each row execute function public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists parking_config_set_updated_at on public.parking_config;
create trigger parking_config_set_updated_at before update on public.parking_config
for each row execute function public.set_updated_at();

create or replace function public.set_booking_code()
returns trigger language plpgsql as $$
begin
  if new.booking_code is null or trim(new.booking_code) = '' then
    new.booking_code := 'SA-' || to_char(now(), 'YYYYMMDD') || '-' ||
      upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_set_booking_code on public.bookings;
create trigger bookings_set_booking_code before insert on public.bookings
for each row execute function public.set_booking_code();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.get_room_availability(
  p_hotel_slug text,
  p_check_in date,
  p_check_out date
)
returns table (
  room_type_id uuid,
  room_type_slug text,
  room_type_name text,
  price_per_night numeric,
  total_rooms integer,
  reserved_rooms bigint,
  available_rooms bigint,
  max_guests integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    rt.id,
    rt.slug,
    rt.name,
    rt.price_per_night,
    rt.total_rooms,
    coalesce(sum(case when b.id is not null then b.rooms_count else 0 end),0)::bigint,
    greatest(
      rt.total_rooms::bigint -
      coalesce(sum(case when b.id is not null then b.rooms_count else 0 end),0)::bigint,
      0
    ),
    rt.max_guests
  from public.room_types rt
  join public.hotels h on h.id = rt.hotel_id
  left join public.bookings b
    on b.room_type_id = rt.id
   and b.status in ('pending','confirmed','checked_in')
   and b.check_in < p_check_out
   and b.check_out > p_check_in
  where h.slug = p_hotel_slug
    and h.is_active = true
    and rt.is_active = true
    and p_check_out > p_check_in
  group by rt.id, rt.slug, rt.name, rt.price_per_night, rt.total_rooms, rt.max_guests
  order by rt.price_per_night asc;
$$;

grant execute on function public.get_room_availability(text,date,date) to anon, authenticated;

create or replace function public.get_parking_availability(
  p_hotel_slug text,
  p_check_in date,
  p_check_out date
)
returns table (
  total_slots integer,
  reserved_slots bigint,
  available_slots bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    pc.total_slots,
    count(b.id)::bigint,
    greatest(pc.total_slots::bigint - count(b.id)::bigint, 0)
  from public.hotels h
  join public.parking_config pc on pc.hotel_id = h.id
  left join public.bookings b
    on b.hotel_id = h.id
   and b.parking_required = true
   and b.status in ('pending','confirmed','checked_in')
   and b.check_in < p_check_out
   and b.check_out > p_check_in
  where h.slug = p_hotel_slug
    and h.is_active = true
    and p_check_out > p_check_in
  group by pc.total_slots;
$$;

grant execute on function public.get_parking_availability(text,date,date) to anon, authenticated;

create or replace function public.create_hotel_booking(
  p_hotel_slug text,
  p_room_type_slug text,
  p_guest_name text,
  p_phone text,
  p_email text,
  p_check_in date,
  p_check_out date,
  p_adults integer,
  p_children integer,
  p_rooms_count integer,
  p_parking_required boolean,
  p_vehicle_number text,
  p_special_requests text
)
returns table (booking_id uuid, booking_code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hotel_id uuid;
  v_room_type_id uuid;
  v_available_rooms bigint;
  v_available_parking bigint;
  v_booking_id uuid;
  v_booking_code text;
begin
  if p_check_out <= p_check_in then
    raise exception 'Check-out date must be after check-in date';
  end if;

  select id into v_hotel_id
  from public.hotels
  where slug = p_hotel_slug and is_active = true;

  if v_hotel_id is null then
    raise exception 'Hotel not found';
  end if;

  select id into v_room_type_id
  from public.room_types
  where hotel_id = v_hotel_id
    and slug = p_room_type_slug
    and is_active = true;

  if v_room_type_id is null then
    raise exception 'Room type not found';
  end if;

  select available_rooms into v_available_rooms
  from public.get_room_availability(p_hotel_slug,p_check_in,p_check_out)
  where room_type_slug = p_room_type_slug;

  if coalesce(v_available_rooms,0) < p_rooms_count then
    raise exception 'Not enough rooms available for selected dates';
  end if;

  if p_parking_required then
    select available_slots into v_available_parking
    from public.get_parking_availability(p_hotel_slug,p_check_in,p_check_out);

    if coalesce(v_available_parking,0) < 1 then
      raise exception 'No parking slot available for selected dates';
    end if;
  end if;

  insert into public.bookings (
    hotel_id, room_type_id, guest_name, phone, email,
    check_in, check_out, adults, children, rooms_count,
    parking_required, vehicle_number, special_requests, status
  ) values (
    v_hotel_id, v_room_type_id, trim(p_guest_name), trim(p_phone),
    nullif(trim(coalesce(p_email,'')),''),
    p_check_in, p_check_out, p_adults, p_children, p_rooms_count,
    p_parking_required,
    nullif(trim(coalesce(p_vehicle_number,'')),''),
    nullif(trim(coalesce(p_special_requests,'')),''),
    'pending'
  )
  returning id, public.bookings.booking_code
  into v_booking_id, v_booking_code;

  return query select v_booking_id, v_booking_code;
end;
$$;

grant execute on function public.create_hotel_booking(
  text,text,text,text,text,date,date,integer,integer,integer,boolean,text,text
) to anon, authenticated;

alter table public.hotels enable row level security;
alter table public.room_types enable row level security;
alter table public.parking_config enable row level security;
alter table public.bookings enable row level security;
alter table public.admin_profiles enable row level security;

drop policy if exists "Public read active hotels" on public.hotels;
create policy "Public read active hotels" on public.hotels
for select to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Public read active room types" on public.room_types;
create policy "Public read active room types" on public.room_types
for select to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Public read parking config" on public.parking_config;
create policy "Public read parking config" on public.parking_config
for select to anon, authenticated using (true);

drop policy if exists "Admins manage hotels" on public.hotels;
create policy "Admins manage hotels" on public.hotels
for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage room types" on public.room_types;
create policy "Admins manage room types" on public.room_types
for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage parking config" on public.parking_config;
create policy "Admins manage parking config" on public.parking_config
for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage bookings" on public.bookings;
create policy "Admins manage bookings" on public.bookings
for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin reads own profile" on public.admin_profiles;
create policy "Admin reads own profile" on public.admin_profiles
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins read admin profiles" on public.admin_profiles;
create policy "Admins read admin profiles" on public.admin_profiles
for select to authenticated
using (public.is_admin());

create index if not exists idx_room_types_hotel on public.room_types(hotel_id);
create index if not exists idx_bookings_hotel_dates on public.bookings(hotel_id,check_in,check_out);
create index if not exists idx_bookings_room_dates on public.bookings(room_type_id,check_in,check_out);
create index if not exists idx_bookings_status on public.bookings(status);
