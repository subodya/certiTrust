create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text null,
  level text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  website_url text null,
  logo_url text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  website_url text null,
  logo_url text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'editor', 'viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.certificates
  add column if not exists course_id uuid null references public.courses(id) on delete set null,
  add column if not exists institution_id uuid null references public.institutions(id) on delete set null,
  add column if not exists partner_id uuid null references public.partners(id) on delete set null,
  add column if not exists student_photo_path text null,
  add column if not exists certificate_qr_path text null,
  add column if not exists verification_url text null;

create index if not exists certificates_course_id_idx on public.certificates(course_id);
create index if not exists certificates_institution_id_idx on public.certificates(institution_id);
create index if not exists certificates_partner_id_idx on public.certificates(partner_id);

insert into public.courses (name, code, level, is_active)
values ('Japanese Language (Equivalent to N2)', 'JP-N2', 'N2', true)
on conflict (name) do nothing;
