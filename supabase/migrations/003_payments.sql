-- Goodson: payments made through Razorpay.
-- Run once in Supabase > SQL Editor > New query > paste > Run.

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  razorpay_order_id text unique not null,
  razorpay_payment_id text,
  status text not null default 'created' check (status in ('created', 'paid', 'failed')),
  plan text,
  term text,
  amount integer not null,          -- smallest unit (cents / paise)
  currency text not null,
  amount_usd integer,
  name text,
  email text,
  phone text,
  pincode text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;

-- Only admins can read payments (the website writes them with the server-only service key).
drop policy if exists "Admins can view payments" on public.payments;
create policy "Admins can view payments"
  on public.payments for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );
