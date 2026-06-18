-- Temporary emergency rollback only.
-- Restores the old browser access if the secure API deployment must be rolled back.

begin;

alter table public.crm_state_store disable row level security;
grant usage on schema public to anon, authenticated;
grant select, insert, update on table public.crm_state_store to anon, authenticated;

commit;

