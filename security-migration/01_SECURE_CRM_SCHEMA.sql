-- DD Connect CRM permanent security foundation
-- Phase 1: Supabase Auth for every user + protected VPS API.
-- This script is additive and does not change crm_state_store access yet.

begin;

create table if not exists public.crm_profiles (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  legacy_id bigint unique,
  login_username text not null unique,
  display_name text not null,
  role text not null check (role in ('Admin','Manager','Executive','Telecaller')),
  branch text not null default 'Madurai Desk',
  phone text not null default '',
  active boolean not null default true,
  manager_auth_user_id uuid references public.crm_profiles(auth_user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_profiles_manager_idx
  on public.crm_profiles(manager_auth_user_id);

create index if not exists crm_profiles_role_idx
  on public.crm_profiles(role);

create or replace function public.set_crm_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_crm_profile_updated_at on public.crm_profiles;
create trigger set_crm_profile_updated_at
before update on public.crm_profiles
for each row execute function public.set_crm_profile_updated_at();

alter table public.crm_profiles enable row level security;

revoke all on table public.crm_profiles from anon, authenticated;
grant select, insert, update, delete on table public.crm_profiles to service_role;

-- Add profiles for Auth admins that already exist.
insert into public.crm_profiles (
  auth_user_id,
  legacy_id,
  login_username,
  display_name,
  role,
  branch,
  phone,
  active
)
select
  u.id,
  null,
  lower(u.email),
  coalesce(
    nullif(u.raw_user_meta_data ->> 'full_name', ''),
    nullif(u.raw_user_meta_data ->> 'name', ''),
    split_part(u.email, '@', 1)
  ),
  'Admin',
  'All Branches',
  coalesce(u.phone, ''),
  true
from auth.users u
where lower(coalesce(u.raw_app_meta_data ->> 'role', '')) = 'admin'
on conflict (auth_user_id) do update set
  login_username = excluded.login_username,
  display_name = excluded.display_name,
  role = 'Admin',
  branch = 'All Branches',
  active = true;

commit;

select
  auth_user_id,
  login_username,
  display_name,
  role,
  active
from public.crm_profiles
order by role, display_name;

