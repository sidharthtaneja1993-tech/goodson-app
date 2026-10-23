-- Goodson: add Delhi NCR PIN codes to the serviceable list.
-- Run once in Supabase > SQL Editor > New query > paste > Run.
-- Ranges are approximate - remove any area you don't actually serve with:
--   update public.serviceable_pincodes set active = false where pincode = 'XXXXXX';

-- Gurugram
insert into public.serviceable_pincodes (pincode, city)
select n::text, 'Gurugram' from generate_series(122001, 122108) as n
on conflict (pincode) do nothing;

-- Noida & Greater Noida
insert into public.serviceable_pincodes (pincode, city)
select n::text, 'Noida' from generate_series(201301, 201318) as n
on conflict (pincode) do nothing;

-- Ghaziabad
insert into public.serviceable_pincodes (pincode, city)
select n::text, 'Ghaziabad' from generate_series(201001, 201021) as n
on conflict (pincode) do nothing;

-- Faridabad
insert into public.serviceable_pincodes (pincode, city)
select n::text, 'Faridabad' from generate_series(121001, 121012) as n
on conflict (pincode) do nothing;
