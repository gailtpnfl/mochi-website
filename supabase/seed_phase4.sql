-- Phase 4 seed: 2 published NFT community collections with gallery items.
-- Run after seed_phase3.sql.

insert into public.nft_collections
  (id, slug, name, description_md, chain, marketplace_url, artist, position, is_published)
values
  (
    '55555555-5555-5555-5555-555555555555',
    'mochi-mascots',
    'Mochi Mascots',
    E'A community art collection celebrating the Mochi mascot, made by artists in our Discord. Showcase only -- not an investment, not affiliated with any token launch.',
    'Ethereum',
    'https://opensea.io',
    'Community artists',
    1,
    true
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'wave-1-graduates',
    'Wave 1 Graduate Badges',
    E'Commemorative art for members who completed the first mentorship wave. A keepsake, not a credential and not for sale.',
    'Polygon',
    'https://magiceden.io',
    'BigBoss',
    2,
    true
  )
on conflict (id) do nothing;

insert into public.nft_items (collection_id, name, image_url, position) values
  ('55555555-5555-5555-5555-555555555555', 'Mochi #1', 'https://placehold.co/600x600?text=Mochi+%231', 1),
  ('55555555-5555-5555-5555-555555555555', 'Mochi #2', 'https://placehold.co/600x600?text=Mochi+%232', 2),
  ('55555555-5555-5555-5555-555555555555', 'Mochi #3', 'https://placehold.co/600x600?text=Mochi+%233', 3),
  ('66666666-6666-6666-6666-666666666666', 'Wave 1 Badge', 'https://placehold.co/600x600?text=Wave+1', 1)
on conflict do nothing;
