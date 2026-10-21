-- Goodson: allow 1 / 3 / 6 / 12-month subscription terms.
-- Run once in Supabase → SQL Editor → New query → paste → Run.

alter table public.waitlist drop constraint if exists waitlist_billing_cycle_check;
alter table public.waitlist add constraint waitlist_billing_cycle_check
  check (billing_cycle in ('monthly', 'annual', '1_month', '3_months', '6_months', '12_months'));
alter table public.waitlist alter column billing_cycle set default '1_month';

alter table public.profiles drop constraint if exists profiles_billing_cycle_check;
alter table public.profiles add constraint profiles_billing_cycle_check
  check (billing_cycle in ('monthly', 'annual', '1_month', '3_months', '6_months', '12_months'));
