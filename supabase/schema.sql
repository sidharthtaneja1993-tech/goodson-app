-- Goodson: core schema
-- Run this in the Supabase SQL editor for your project.

-- 1. Profiles: one row per authenticated user, extends auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  plan text check (plan in ('companion', 'guardian', 'prestige')),
  billing_cycle text check (billing_cycle in ('monthly', 'annual')) default 'monthly',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins can read every profile (used by the /admin dashboard)
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Waitlist: public landing-page signups (no auth required)
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  pincode text,
  plan text check (plan in ('companion', 'guardian', 'prestige')),
  billing_cycle text check (billing_cycle in ('monthly', 'annual')) default 'monthly',
  message text,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Anyone (anon key) can insert a waitlist entry from the public form
create policy "Anyone can join the waitlist"
  on public.waitlist for insert
  with check (true);

-- Only admins can read the waitlist
create policy "Admins can view waitlist"
  on public.waitlist for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- 3. Serviceable pincodes: PIN codes Goodson currently covers
create table if not exists public.serviceable_pincodes (
  pincode text primary key,
  city text,
  active boolean not null default true
);

alter table public.serviceable_pincodes enable row level security;

create policy "Anyone can check serviceability"
  on public.serviceable_pincodes for select
  using (true);

-- Seed: all of Delhi (110xxx) to start
insert into public.serviceable_pincodes (pincode, city)
select '110' || lpad(n::text, 3, '0'), 'Delhi'
from generate_series(0, 99) as n
on conflict (pincode) do nothing;

-- To make the first account an admin after they sign up, run:
-- update public.profiles set is_admin = true where id = '<user-uuid>';
