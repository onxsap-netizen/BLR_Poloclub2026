-- ============================================================
-- ThePoloClub.BLR — Supabase Schema
-- Run this entire file in Supabase Dashboard → SQL Editor
-- ============================================================

-- Extension for UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLE: applications
-- ============================================================
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),

  -- Step 1: Personal Details
  full_name text not null,
  phone_number text not null,
  email text not null,
  city text not null,
  occupation text not null,

  -- Step 2: Car Details
  polo_variant text not null,
  car_year text not null,
  transmission text not null,
  fuel_type text not null,
  car_colour text not null,
  registration_number text not null,
  photo_front_url text,
  photo_rear_url text,
  photo_side_url text,
  photo_interior_url text,
  is_modified boolean not null default false,
  modification_details text,

  -- Step 3: Community Questions
  why_join text not null,
  polo_story text not null,
  previous_club boolean not null default false,
  previous_club_details text,
  ever_removed boolean not null default false,
  emergency_contact_name text not null,
  emergency_contact_number text not null,
  has_insurance boolean not null default false,
  insurance_url text,

  -- Step 4: Rules
  rules_accepted boolean not null default false,

  -- Admin fields
  admin_notes text,
  reviewed_by text,
  reviewed_at timestamptz
);

create index if not exists idx_applications_status on applications(status);
create index if not exists idx_applications_created_at on applications(created_at desc);

-- ============================================================
-- TABLE: events
-- ============================================================
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  title text not null,
  category text not null default 'Upcoming Drives',
  description text not null,
  event_date date not null,
  event_time text,
  location text not null,
  cover_image_url text,
  gallery_urls text[] not null default '{}',
  is_published boolean not null default true
);

create index if not exists idx_events_date on events(event_date);
create index if not exists idx_events_published on events(is_published);

alter table events enable row level security;

-- Public can view published events
create policy "Anyone can view published events"
  on events for select
  to anon
  using (is_published = true);

-- Storage bucket for event images
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

create policy "Anyone can view event images"
  on storage.objects for select
  to anon
  using (bucket_id = 'event-images');

-- NOTE: INSERT/UPDATE/DELETE on `events` and uploads to `event-images` are
-- intentionally NOT granted to `anon`. The admin panel uses the service-role
-- key (server-side only) to manage events. Never expose the service-role key
-- to the browser.

-- ============================================================
-- TABLE: members (created automatically when application approved)
-- ============================================================
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete set null,
  full_name text not null,
  city text not null,
  car_photo_url text,
  polo_variant text not null,
  story text,
  drives_attended int not null default 0,
  badges text[] not null default '{}',
  joined_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table applications enable row level security;
alter table members enable row level security;

-- Public (anon) can INSERT a new application (submit the join form)
create policy "Anyone can submit an application"
  on applications for insert
  to anon
  with check (true);

-- Public (anon) can view approved members (member profiles/gallery)
create policy "Anyone can view members"
  on members for select
  to anon
  using (true);

-- NOTE: SELECT/UPDATE/DELETE on `applications` is intentionally NOT
-- granted to `anon`. The admin panel must use the Supabase service-role
-- key (server-side only, via a Next.js Route Handler / Server Action)
-- to read and update applications. Never expose the service-role key
-- to the browser.

-- ============================================================
-- STORAGE BUCKETS
-- Run in Supabase Dashboard → Storage, or via SQL below
-- ============================================================
insert into storage.buckets (id, name, public)
values ('car-photos', 'car-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('insurance-docs', 'insurance-docs', false)
on conflict (id) do nothing;

-- Allow anon uploads to car-photos (join form uploads)
create policy "Anyone can upload car photos"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'car-photos');

create policy "Anyone can view car photos"
  on storage.objects for select
  to anon
  using (bucket_id = 'car-photos');

-- Insurance docs: anon can upload but NOT read back (admin-only via service role)
create policy "Anyone can upload insurance docs"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'insurance-docs');
