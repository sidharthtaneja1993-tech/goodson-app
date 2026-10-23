-- Goodson: auto-renewing subscriptions through Razorpay.
-- Run once in Supabase > SQL Editor > New query > paste > Run.

-- Razorpay "plans" are created automatically the first time each
-- plan + length + price is used; this table remembers their ids.
create table if not exists public.razorpay_plans (
  key text primary key,              -- e.g. guardian:3_months:USD:28200
  razorpay_plan_id text not null,
  created_at timestamptz not null default now()
);
alter table public.razorpay_plans enable row level security;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  razorpay_subscription_id text unique not null,
  razorpay_plan_id text,
  status text not null default 'created',  -- created, active, pending, halted, cancelled, completed
  cancel_requested boolean not null default false,
  plan text,
  term text,
  amount integer not null,                 -- per renewal, smallest unit (cents / paise)
  currency text not null,
  amount_usd integer,
  name text,
  email text,
  phone text,
  pincode text,
  paid_count integer not null default 0,
  current_end timestamptz,                 -- when the current paid period ends (= next renewal)
  reminder_sent_for timestamptz,           -- current_end we already sent a reminder for
  last_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;

drop policy if exists "Admins can view subscriptions" on public.subscriptions;
create policy "Admins can view subscriptions"
  on public.subscriptions for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));
