-- Goodson: remember which automatic follow-up emails have been sent,
-- so each person gets at most one of each.
-- Run once in Supabase > SQL Editor > New query > paste > Run.

alter table public.waitlist add column if not exists followup_sent_at timestamptz;
alter table public.parent_intakes add column if not exists reminder_sent_at timestamptz;
