-- Phase 4 schema: NFT Community Collections. Display-only galleries linking
-- out to marketplaces -- no minting, no wallet connect, per the launch
-- plan's hard scope exclusions. Merch stays an external link (no `products`
-- table) until a native store is explicitly warranted.

create table public.nft_collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description_md text,
  chain text,
  cover_image_url text,
  marketplace_url text,
  artist text,
  position integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.nft_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.nft_collections (id) on delete cascade,
  name text,
  image_url text not null,
  position integer not null default 0
);

create index nft_items_collection_position_idx on public.nft_items (collection_id, position);

create trigger nft_collections_set_updated_at before update on public.nft_collections
  for each row execute function public.set_updated_at();

alter table public.nft_collections enable row level security;
alter table public.nft_items enable row level security;

-- nft_collections: public read published, admin full access
create policy "nft_collections_public_read" on public.nft_collections
  for select using (is_published = true or public.is_admin());
create policy "nft_collections_admin_insert" on public.nft_collections
  for insert with check (public.is_admin());
create policy "nft_collections_admin_update" on public.nft_collections
  for update using (public.is_admin()) with check (public.is_admin());
create policy "nft_collections_admin_delete" on public.nft_collections
  for delete using (public.is_admin());

-- nft_items: visible whenever the parent collection is visible; admin write
create policy "nft_items_public_read" on public.nft_items
  for select using (
    exists (
      select 1 from public.nft_collections c
      where c.id = collection_id and (c.is_published = true or public.is_admin())
    )
  );
create policy "nft_items_admin_insert" on public.nft_items
  for insert with check (public.is_admin());
create policy "nft_items_admin_update" on public.nft_items
  for update using (public.is_admin()) with check (public.is_admin());
create policy "nft_items_admin_delete" on public.nft_items
  for delete using (public.is_admin());

grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
