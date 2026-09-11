-- Mochi Web3 -- Phase 1 schema: users, airdrops, guide_revisions, partners,
-- announcements, newsletter_subscribers, listing_views, team_members,
-- partnership_inquiries.

create extension if not exists "pgcrypto";

-- ===================================================================
-- Tables
-- ===================================================================

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin')),
  discord_id text,
  discord_username text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  created_at timestamptz not null default now()
);

create table public.airdrops (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  chain text,
  status text not null default 'upcoming' check (status in ('upcoming', 'live', 'ended')),
  is_featured boolean not null default false,
  summary text,
  guide_md text,
  external_url text,
  partner_id uuid references public.partners (id) on delete set null,
  cover_image_url text,
  is_archived boolean not null default false,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guide_revisions (
  id uuid primary key default gen_random_uuid(),
  airdrop_id uuid not null references public.airdrops (id) on delete cascade,
  guide_md text not null,
  edited_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  role_title text not null,
  bio_md text,
  avatar_url text,
  socials jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body_md text not null,
  is_published boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table public.partnership_inquiries (
  id uuid primary key default gen_random_uuid(),
  org_name text not null,
  contact_name text,
  email text not null,
  message text,
  status text not null default 'new' check (status in ('new', 'in_talks', 'closed')),
  created_at timestamptz not null default now()
);

create table public.listing_views (
  id uuid primary key default gen_random_uuid(),
  airdrop_id uuid not null references public.airdrops (id) on delete cascade,
  viewer_id uuid references public.users (id) on delete set null,
  viewed_at timestamptz not null default now()
);

-- ===================================================================
-- Indexes
-- ===================================================================

create index airdrops_status_idx on public.airdrops (status) where is_archived = false;
create index airdrops_featured_idx on public.airdrops (is_featured) where is_featured = true;
create index guide_revisions_airdrop_idx on public.guide_revisions (airdrop_id, created_at desc);
create index team_members_position_idx on public.team_members (position);
create index announcements_published_idx on public.announcements (is_published, published_at desc);
create index listing_views_airdrop_idx on public.listing_views (airdrop_id, viewed_at desc);

-- ===================================================================
-- updated_at trigger
-- ===================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at before update on public.users
  for each row execute function public.set_updated_at();
create trigger airdrops_set_updated_at before update on public.airdrops
  for each row execute function public.set_updated_at();
create trigger team_members_set_updated_at before update on public.team_members
  for each row execute function public.set_updated_at();
create trigger announcements_set_updated_at before update on public.announcements
  for each row execute function public.set_updated_at();

-- ===================================================================
-- Auto-create a public.users row when someone signs up via Supabase Auth
-- ===================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, display_name, avatar_url, discord_id, discord_username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'provider_id',
    new.raw_user_meta_data ->> 'user_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===================================================================
-- Row Level Security
-- ===================================================================

alter table public.users enable row level security;
alter table public.partners enable row level security;
alter table public.airdrops enable row level security;
alter table public.guide_revisions enable row level security;
alter table public.team_members enable row level security;
alter table public.announcements enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.partnership_inquiries enable row level security;
alter table public.listing_views enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$;

-- users: read/update own row; admin can read + manage all
create policy "users_select_own_or_admin" on public.users
  for select using (auth.uid() = id or public.is_admin());
create policy "users_update_own" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "users_admin_manage" on public.users
  for all using (public.is_admin()) with check (public.is_admin());

-- partners: public read, admin write
create policy "partners_public_read" on public.partners
  for select using (true);
create policy "partners_admin_insert" on public.partners
  for insert with check (public.is_admin());
create policy "partners_admin_update" on public.partners
  for update using (public.is_admin()) with check (public.is_admin());
create policy "partners_admin_delete" on public.partners
  for delete using (public.is_admin());

-- airdrops: public read non-archived, admin full access
create policy "airdrops_public_read" on public.airdrops
  for select using (is_archived = false or public.is_admin());
create policy "airdrops_admin_insert" on public.airdrops
  for insert with check (public.is_admin());
create policy "airdrops_admin_update" on public.airdrops
  for update using (public.is_admin()) with check (public.is_admin());
create policy "airdrops_admin_delete" on public.airdrops
  for delete using (public.is_admin());

-- guide_revisions: admin-only audit log
create policy "guide_revisions_admin_read" on public.guide_revisions
  for select using (public.is_admin());
create policy "guide_revisions_admin_insert" on public.guide_revisions
  for insert with check (public.is_admin());

-- team_members: public read active, admin full access
create policy "team_members_public_read" on public.team_members
  for select using (is_active = true or public.is_admin());
create policy "team_members_admin_insert" on public.team_members
  for insert with check (public.is_admin());
create policy "team_members_admin_update" on public.team_members
  for update using (public.is_admin()) with check (public.is_admin());
create policy "team_members_admin_delete" on public.team_members
  for delete using (public.is_admin());

-- announcements: public read published, admin full access
create policy "announcements_public_read" on public.announcements
  for select using (is_published = true or public.is_admin());
create policy "announcements_admin_insert" on public.announcements
  for insert with check (public.is_admin());
create policy "announcements_admin_update" on public.announcements
  for update using (public.is_admin()) with check (public.is_admin());
create policy "announcements_admin_delete" on public.announcements
  for delete using (public.is_admin());

-- newsletter_subscribers: insert-only public, admin read
create policy "newsletter_public_insert" on public.newsletter_subscribers
  for insert with check (true);
create policy "newsletter_admin_read" on public.newsletter_subscribers
  for select using (public.is_admin());

-- partnership_inquiries: insert-only public, admin read/update
create policy "inquiries_public_insert" on public.partnership_inquiries
  for insert with check (true);
create policy "inquiries_admin_read" on public.partnership_inquiries
  for select using (public.is_admin());
create policy "inquiries_admin_update" on public.partnership_inquiries
  for update using (public.is_admin()) with check (public.is_admin());

-- listing_views: anonymous insert for analytics, admin read
create policy "listing_views_public_insert" on public.listing_views
  for insert with check (true);
create policy "listing_views_admin_read" on public.listing_views
  for select using (public.is_admin());
