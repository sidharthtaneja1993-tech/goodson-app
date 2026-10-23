-- Goodson: parents' details collected right after payment.
-- Run once in Supabase > SQL Editor > New query > paste > Run.

create table if not exists public.parent_intakes (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,          -- private link: goodson.in/onboarding/<token>
  ref text unique not null,            -- Razorpay order id or subscription id
  name text,
  email text,
  phone text,
  plan text,
  term text,
  status text not null default 'pending' check (status in ('pending', 'submitted')),
  data jsonb,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.parent_intakes enable row level security;

drop policy if exists "Admins can view parent intakes" on public.parent_intakes;
create policy "Admins can view parent intakes"
  on public.parent_intakes for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));
