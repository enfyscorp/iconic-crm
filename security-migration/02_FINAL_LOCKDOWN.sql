-- DD Connect CRM final lock-down.
-- DO NOT RUN until:
-- 1. The secure CRM API is running.
-- 2. All staff have Supabase Auth accounts.
-- 3. Admin, Manager, Executive and Telecaller tests have passed.
-- 4. The new frontend is live.

begin;

alter table public.crm_state_store enable row level security;

drop policy if exists "crm_state_store_authenticated_select" on public.crm_state_store;
drop policy if exists "crm_state_store_authenticated_insert" on public.crm_state_store;
drop policy if exists "crm_state_store_authenticated_update" on public.crm_state_store;
drop policy if exists "crm_state_store_authenticated_delete" on public.crm_state_store;

revoke all on table public.crm_state_store from anon, authenticated;
grant select, insert, update, delete on table public.crm_state_store to service_role;

commit;

select
  relrowsecurity as rls_enabled
from pg_class
where oid = 'public.crm_state_store'::regclass;

select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'crm_state_store'
  and grantee in ('anon','authenticated','service_role')
order by grantee, privilege_type;

