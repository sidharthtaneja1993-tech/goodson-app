-- Goodson: allow the new "companion_remote" plan.
-- Run once in Supabase > SQL Editor > New query > paste > Run.

alter table public.waitlist drop constraint if exists waitlist_plan_check;
alter table public.waitlist add constraint waitlist_plan_check
  check (plan in ('companion', 'guardian', 'prestige', 'companion_remote'));

alter table public.profiles drop constraint if exists profiles_plan_check;
alter table public.profiles add constraint profiles_plan_check
  check (plan in ('companion', 'guardian', 'prestige', 'companion_remote'));
