create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_id text not null unique,
  full_name text not null,
  course text not null,
  issue_date date not null,
  completion_date date null,
  enrollment_date date null,
  duration text null,
  institute text null,
  registration_number text null,
  issuing_authority text null,
  date_of_birth date null,
  nic_number text null,
  email text null,
  status text not null check (status in ('valid', 'invalid')),
  image_url text null,
  institution_logo_url text null,
  partner_logo_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists certificates_certificate_id_idx
  on public.certificates (certificate_id);
