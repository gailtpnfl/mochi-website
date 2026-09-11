-- Phase 3 schema: Mentorship (cohorts/applications/members/sessions/trade
-- reviews), the private Mochi Trading Journal, and Job Opportunities.
--
-- Note: there is no dedicated "mentor" auth role yet -- cohort_members.role
-- tracks mentor vs. mentee, and a mentor acts on a trade_review only once
-- explicitly assigned as its `reviewed_by`. Admins can always manage
-- everything except journal_entries, which stay strictly owner-only even
-- for admins (see journal_entries policies below).

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description_md text,
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'completed')),
  starts_at date,
  ends_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cohort_applications (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  motivation_md text,
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'waitlisted')),
  reviewed_by uuid references public.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (cohort_id, user_id)
);

create table public.cohort_members (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  role text not null default 'mentee' check (role in ('mentee', 'mentor')),
  joined_at timestamptz not null default now(),
  unique (cohort_id, user_id)
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  title text not null,
  description_md text,
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 60,
  location_url text,
  created_at timestamptz not null default now()
);

create table public.trade_reviews (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  reviewed_by uuid references public.users (id) on delete set null,
  title text not null,
  submission_md text,
  feedback_md text,
  status text not null default 'submitted' check (status in ('submitted', 'reviewed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  traded_at date not null,
  symbol text not null,
  direction text not null check (direction in ('long', 'short')),
  entry_price numeric,
  exit_price numeric,
  stop_price numeric,
  size numeric,
  r_multiple numeric,
  outcome text check (outcome in ('win', 'loss', 'breakeven', 'open')),
  screenshot_url text,
  notes_md text,
  shared_review_id uuid references public.trade_reviews (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_postings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  org text not null default 'Mochi Agency',
  type text not null check (type in ('full_time', 'part_time', 'contract', 'volunteer')),
  location text not null default 'Remote',
  description_md text,
  apply_url text,
  status text not null default 'open' check (status in ('open', 'closed')),
  posted_at timestamptz not null default now()
);

create index cohort_applications_cohort_idx on public.cohort_applications (cohort_id, status);
create index cohort_members_cohort_idx on public.cohort_members (cohort_id);
create index sessions_cohort_scheduled_idx on public.sessions (cohort_id, scheduled_at);
create index trade_reviews_cohort_idx on public.trade_reviews (cohort_id, status);
create index journal_entries_user_traded_idx on public.journal_entries (user_id, traded_at desc);
create index job_postings_status_idx on public.job_postings (status);

create trigger cohorts_set_updated_at before update on public.cohorts
  for each row execute function public.set_updated_at();
create trigger trade_reviews_set_updated_at before update on public.trade_reviews
  for each row execute function public.set_updated_at();
create trigger journal_entries_set_updated_at before update on public.journal_entries
  for each row execute function public.set_updated_at();

alter table public.cohorts enable row level security;
alter table public.cohort_applications enable row level security;
alter table public.cohort_members enable row level security;
alter table public.sessions enable row level security;
alter table public.trade_reviews enable row level security;
alter table public.journal_entries enable row level security;
alter table public.job_postings enable row level security;

-- helper: is the current user a member (any role) of this cohort?
create or replace function public.is_cohort_member(target_cohort_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.cohort_members
    where cohort_id = target_cohort_id and user_id = auth.uid()
  );
$$;

-- cohorts: public read, admin write
create policy "cohorts_public_read" on public.cohorts
  for select using (true);
create policy "cohorts_admin_insert" on public.cohorts
  for insert with check (public.is_admin());
create policy "cohorts_admin_update" on public.cohorts
  for update using (public.is_admin()) with check (public.is_admin());
create policy "cohorts_admin_delete" on public.cohorts
  for delete using (public.is_admin());

-- cohort_applications: applicant can insert/read own; admin full access
create policy "applications_owner_read" on public.cohort_applications
  for select using (auth.uid() = user_id or public.is_admin());
create policy "applications_owner_insert" on public.cohort_applications
  for insert with check (auth.uid() = user_id);
create policy "applications_admin_update" on public.cohort_applications
  for update using (public.is_admin()) with check (public.is_admin());
create policy "applications_admin_delete" on public.cohort_applications
  for delete using (public.is_admin());

-- cohort_members: member can read own row + cohort-mates; admin full access
create policy "cohort_members_read" on public.cohort_members
  for select using (
    auth.uid() = user_id or public.is_cohort_member(cohort_id) or public.is_admin()
  );
create policy "cohort_members_admin_write" on public.cohort_members
  for insert with check (public.is_admin());
create policy "cohort_members_admin_update" on public.cohort_members
  for update using (public.is_admin()) with check (public.is_admin());
create policy "cohort_members_admin_delete" on public.cohort_members
  for delete using (public.is_admin());

-- sessions: visible to cohort members + admin; admin write
create policy "sessions_member_read" on public.sessions
  for select using (public.is_cohort_member(cohort_id) or public.is_admin());
create policy "sessions_admin_insert" on public.sessions
  for insert with check (public.is_admin());
create policy "sessions_admin_update" on public.sessions
  for update using (public.is_admin()) with check (public.is_admin());
create policy "sessions_admin_delete" on public.sessions
  for delete using (public.is_admin());

-- trade_reviews: submitter (owner) and assigned reviewer can read/update;
-- submitter inserts their own; admin has full access (acts as mentor
-- until a dedicated mentor role exists)
create policy "trade_reviews_read" on public.trade_reviews
  for select using (
    auth.uid() = user_id or auth.uid() = reviewed_by or public.is_admin()
  );
create policy "trade_reviews_owner_insert" on public.trade_reviews
  for insert with check (auth.uid() = user_id);
create policy "trade_reviews_update" on public.trade_reviews
  for update
  using (auth.uid() = reviewed_by or public.is_admin())
  with check (auth.uid() = reviewed_by or public.is_admin());
create policy "trade_reviews_admin_delete" on public.trade_reviews
  for delete using (public.is_admin());

-- journal_entries: strictly owner-only, INCLUDING admins. The only extra
-- visibility is the assigned reviewer of a trade_review the member
-- explicitly shared this entry to, per the launch plan's privacy design.
create policy "journal_owner_all" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "journal_shared_reviewer_read" on public.journal_entries
  for select using (
    shared_review_id is not null
    and exists (
      select 1 from public.trade_reviews tr
      where tr.id = shared_review_id and tr.reviewed_by = auth.uid()
    )
  );

-- job_postings: public read open postings, admin full access
create policy "job_postings_public_read" on public.job_postings
  for select using (status = 'open' or public.is_admin());
create policy "job_postings_admin_insert" on public.job_postings
  for insert with check (public.is_admin());
create policy "job_postings_admin_update" on public.job_postings
  for update using (public.is_admin()) with check (public.is_admin());
create policy "job_postings_admin_delete" on public.job_postings
  for delete using (public.is_admin());

grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
