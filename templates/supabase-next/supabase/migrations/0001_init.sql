-- =============================================================================
-- nextjs-supabase-saas-starter — initial schema
--
-- Multi-tenant model:
--   orgs            : a workspace / tenant
--   org_members     : membership (which users belong to which org + role)
--   projects        : example tenant-scoped resource (RLS by org membership)
--   provider_keys   : BYOK provider API keys, encrypted at rest (per user)
--
-- All tables are protected by Row Level Security so a client using the anon
-- key can only ever read/write rows it is authorized for.
-- =============================================================================

-- ----------------------------------------------------------------------------
-- orgs
-- ----------------------------------------------------------------------------
create table if not exists public.orgs (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  owner_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.orgs enable row level security;

-- ----------------------------------------------------------------------------
-- org_members
-- ----------------------------------------------------------------------------
create table if not exists public.org_members (
  org_id     uuid not null references public.orgs (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  role       text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

alter table public.org_members enable row level security;

-- Helper: is the current user a member of a given org?
create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.org_members m
    where m.org_id = target_org
      and m.user_id = auth.uid()
  );
$$;

-- Auto-create an org + owner membership when a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
begin
  insert into public.orgs (name, owner_id)
  values (coalesce(new.raw_user_meta_data ->> 'org_name', 'My Workspace'), new.id)
  returning id into new_org_id;

  insert into public.org_members (org_id, user_id, role)
  values (new_org_id, new.id, 'owner');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- projects (tenant-scoped example resource)
-- ----------------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.orgs (id) on delete cascade,
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

alter table public.projects enable row level security;

create index if not exists projects_org_id_idx on public.projects (org_id);

-- ----------------------------------------------------------------------------
-- provider_keys (BYOK — encrypted at rest, scoped to the owning user)
-- ----------------------------------------------------------------------------
create table if not exists public.provider_keys (
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  provider      text not null,
  -- App-layer AES-256-GCM ciphertext (see src/lib/crypto.ts). The DB never
  -- stores the plaintext key. Alternatively, pgcrypto could encrypt here:
  --   pgp_sym_encrypt(plaintext, current_setting('app.encryption_key'))
  encrypted_key text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  primary key (user_id, provider)
);

alter table public.provider_keys enable row level security;

-- =============================================================================
-- Row Level Security policies
-- =============================================================================

-- orgs: members can read; only the owner can update/delete; any authed user can
-- create an org they own.
drop policy if exists "orgs_select_members" on public.orgs;
create policy "orgs_select_members" on public.orgs
  for select using (public.is_org_member(id));

drop policy if exists "orgs_insert_self" on public.orgs;
create policy "orgs_insert_self" on public.orgs
  for insert with check (owner_id = auth.uid());

drop policy if exists "orgs_update_owner" on public.orgs;
create policy "orgs_update_owner" on public.orgs
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "orgs_delete_owner" on public.orgs;
create policy "orgs_delete_owner" on public.orgs
  for delete using (owner_id = auth.uid());

-- org_members: a user can see membership rows for orgs they belong to, and can
-- always see their own membership row.
drop policy if exists "members_select" on public.org_members;
create policy "members_select" on public.org_members
  for select using (user_id = auth.uid() or public.is_org_member(org_id));

drop policy if exists "members_insert_self" on public.org_members;
create policy "members_insert_self" on public.org_members
  for insert with check (user_id = auth.uid());

-- projects: scoped to org membership.
drop policy if exists "projects_select_org" on public.projects;
create policy "projects_select_org" on public.projects
  for select using (public.is_org_member(org_id));

drop policy if exists "projects_insert_org" on public.projects;
create policy "projects_insert_org" on public.projects
  for insert with check (public.is_org_member(org_id) and owner_id = auth.uid());

drop policy if exists "projects_update_org" on public.projects;
create policy "projects_update_org" on public.projects
  for update using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

drop policy if exists "projects_delete_org" on public.projects;
create policy "projects_delete_org" on public.projects
  for delete using (public.is_org_member(org_id));

-- provider_keys: strictly per-user. No org sharing.
drop policy if exists "provider_keys_all_self" on public.provider_keys;
create policy "provider_keys_all_self" on public.provider_keys
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
