-- Phase 2 schema: Learn Web3 (courses/lessons/progress), Trading Materials
-- registry, and the BigDaddyDaks watchlist.

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description_md text,
  cover_image_url text,
  is_published boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  slug text not null,
  title text not null,
  module_title text,
  video_url text,
  content_md text,
  position integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, slug)
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table public.trading_tools (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  tool_type text not null check (tool_type in ('calculator', 'indicator', 'watchlist', 'journal', 'page')),
  access text not null default 'public' check (access in ('public', 'members', 'mentees')),
  asset_url text,
  position integer not null default 0
);

create table public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  exchange text,
  thesis_md text,
  status text not null default 'watching' check (status in ('watching', 'active', 'closed')),
  added_by uuid references public.users (id) on delete set null,
  added_at timestamptz not null default now(),
  closed_at timestamptz
);

create index lessons_course_position_idx on public.lessons (course_id, position);
create index lesson_progress_user_idx on public.lesson_progress (user_id, lesson_id);
create index watchlist_items_status_idx on public.watchlist_items (status, added_at);

create trigger courses_set_updated_at before update on public.courses
  for each row execute function public.set_updated_at();
create trigger lessons_set_updated_at before update on public.lessons
  for each row execute function public.set_updated_at();

alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.trading_tools enable row level security;
alter table public.watchlist_items enable row level security;

-- courses / lessons: public read published, admin full access
create policy "courses_public_read" on public.courses
  for select using (is_published = true or public.is_admin());
create policy "courses_admin_insert" on public.courses
  for insert with check (public.is_admin());
create policy "courses_admin_update" on public.courses
  for update using (public.is_admin()) with check (public.is_admin());
create policy "courses_admin_delete" on public.courses
  for delete using (public.is_admin());

create policy "lessons_public_read" on public.lessons
  for select using (is_published = true or public.is_admin());
create policy "lessons_admin_insert" on public.lessons
  for insert with check (public.is_admin());
create policy "lessons_admin_update" on public.lessons
  for update using (public.is_admin()) with check (public.is_admin());
create policy "lessons_admin_delete" on public.lessons
  for delete using (public.is_admin());

-- lesson_progress: owner-only (mirrors the journal_entries privacy pattern)
create policy "lesson_progress_owner_all" on public.lesson_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- trading_tools: public read (the hub lists gated tools too, just marked
-- locked); admin write. Access-gating of the underlying asset happens in
-- the app layer per `access`, not by hiding the registry row.
create policy "trading_tools_public_read" on public.trading_tools
  for select using (true);
create policy "trading_tools_admin_insert" on public.trading_tools
  for insert with check (public.is_admin());
create policy "trading_tools_admin_update" on public.trading_tools
  for update using (public.is_admin()) with check (public.is_admin());
create policy "trading_tools_admin_delete" on public.trading_tools
  for delete using (public.is_admin());

-- watchlist_items: public read, admin write (mentor role doesn't exist yet;
-- revisit when Phase 3 introduces cohort/mentor roles)
create policy "watchlist_public_read" on public.watchlist_items
  for select using (true);
create policy "watchlist_admin_insert" on public.watchlist_items
  for insert with check (public.is_admin());
create policy "watchlist_admin_update" on public.watchlist_items
  for update using (public.is_admin()) with check (public.is_admin());
create policy "watchlist_admin_delete" on public.watchlist_items
  for delete using (public.is_admin());

grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
