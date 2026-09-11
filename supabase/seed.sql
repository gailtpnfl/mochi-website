-- Phase 1 seed data: 2 partners, 6 airdrops, 4 team members, 2 announcements.
-- Run after 0001_init.sql on a local/staging Supabase project.

insert into public.partners (id, name, website_url) values
  ('11111111-1111-1111-1111-111111111111', 'LayerZero Labs', 'https://layerzero.network'),
  ('22222222-2222-2222-2222-222222222222', 'zkSync', 'https://zksync.io')
on conflict (id) do nothing;

insert into public.airdrops
  (slug, title, chain, status, is_featured, summary, guide_md, external_url, partner_id, cover_image_url)
values
  (
    'layerzero-omnichain-rewards',
    'LayerZero Omnichain Rewards',
    'Multi-chain',
    'live',
    true,
    'Bridge and interact across LayerZero-connected chains to build eligibility for future rewards.',
    E'## What you need to do\n\n1. Bridge assets using a LayerZero-powered bridge (e.g. Stargate).\n2. Interact on at least 3 different connected chains.\n3. Hold your bridged position for a few weeks between transactions.\n\n> This is educational curation, not financial advice. Do your own research before bridging funds.',
    'https://layerzero.network',
    '11111111-1111-1111-1111-111111111111',
    null
  ),
  (
    'zksync-ignite',
    'zkSync Ignite',
    'zkSync Era',
    'live',
    true,
    'Use zkSync Era dApps regularly to build an on-chain activity history.',
    E'## Guide\n\n1. Bridge ETH to zkSync Era.\n2. Swap on a native DEX.\n3. Try lending/borrowing on a supported protocol.\n\nSpread activity across multiple weeks rather than a single day.',
    'https://zksync.io',
    '22222222-2222-2222-2222-222222222222',
    null
  ),
  (
    'scroll-genesis-quests',
    'Scroll Genesis Quests',
    'Scroll',
    'upcoming',
    false,
    'Scroll has not confirmed a token, but the ecosystem is active with an official badge/quest system.',
    E'## Guide\n\n1. Bridge to Scroll via the official bridge.\n2. Mint the Scroll Origins NFT if eligible.\n3. Try 2-3 native dApps.',
    'https://scroll.io',
    null,
    null
  ),
  (
    'linea-voyage',
    'Linea Voyage',
    'Linea',
    'upcoming',
    false,
    'Linea runs recurring "Voyage" campaigns rewarding on-chain participation with LXP points.',
    E'## Guide\n\n1. Bridge to Linea.\n2. Complete the current Voyage tasks from the official dashboard.\n3. Track your LXP balance.',
    'https://linea.build',
    null,
    null
  ),
  (
    'arbitrum-odyssey-s2',
    'Arbitrum Odyssey Season 2',
    'Arbitrum',
    'ended',
    false,
    'A past campaign rewarding cross-protocol activity on Arbitrum One and Nova.',
    E'## Recap\n\nThis campaign has ended. Kept here for reference on the kind of activity that historically counted: bridging, DEX swaps, and NFT mints across partner protocols.',
    'https://arbitrum.io',
    null,
    null
  ),
  (
    'starknet-provisions',
    'Starknet Provisions',
    'Starknet',
    'ended',
    false,
    'Starknet''s STRK "Provisions" airdrop rewarded early users, builders, and Starknet.id holders.',
    E'## Recap\n\nThis distribution has concluded. Historical guide kept for reference: wallet activity, Starknet.id domains, and contract deployments were among the qualifying criteria.',
    'https://starknet.io',
    null,
    null
  )
on conflict (slug) do nothing;

insert into public.team_members
  (display_name, role_title, tier, bio_md, avatar_url, socials, position, is_active)
values
  -- Founder
  ('Christer Saromines', 'Founder', 'founder',
   'Started Mochi Web3 to make Web3 education free and accessible to all.',
   null, '{}'::jsonb, 1, true),

  -- Leadership
  -- @Patatas is Abegail Joyce Peñafiel — one person, one row. A previous pass
  -- split this into two on the understanding they were separate people; the
  -- roster owner confirmed the original pairing was right.
  ('Sheyenne Shamir Pagulayan', 'Chief of Operations',      'leadership', null, null, '{}'::jsonb, 1, true),
  ('Abegail Joyce Peñafiel',    'Chief Technology Officer', 'leadership', null, null, '{}'::jsonb, 2, true),
  ('Jose Gabriel Fornier',      'Chief Commercial Officer', 'leadership', null, null, '{}'::jsonb, 3, true),
  ('Grace Ann Tomaneng',        'Chief Marketing Officer',  'leadership', null, null, '{}'::jsonb, 4, true),

  -- Trading Managers
  ('RoadToMillions', 'Trading Manager', 'trading_manager', null, null, '{}'::jsonb, 1, true),
  ('Don Kalmado',    'Trading Manager', 'trading_manager', null, null, '{}'::jsonb, 2, true),
  ('Ryzen',          'Trading Manager', 'trading_manager', null, null, '{}'::jsonb, 3, true),
  ('CryptoBeast',    'Trading Manager', 'trading_manager', null, null, '{}'::jsonb, 4, true),
  ('Tope',           'Trading Manager', 'trading_manager', null, null, '{}'::jsonb, 5, true),
  ('Arki',           'Trading Manager', 'trading_manager', null, null, '{}'::jsonb, 6, true),
  ('AngCool',        'Trading Manager', 'trading_manager', null, null, '{}'::jsonb, 7, true),

  -- Director of Community
  ('Miguel Leonido Cura', 'Director of Community', 'director', null, null, '{}'::jsonb, 1, true),

  -- Community Moderators
  -- Tope also appears above as a Trading Manager; they hold both roles, so the
  -- roster carries two rows (one row can only belong to one tier).
  ('Tope',    'Community Moderator', 'moderator', null, null, '{}'::jsonb, 1, true),
  ('Rico',    'Community Moderator', 'moderator', null, null, '{}'::jsonb, 2, true),
  ('Plasma',  'Community Moderator', 'moderator', null, null, '{}'::jsonb, 3, true),
  ('Chekwa',  'Community Moderator', 'moderator', null, null, '{}'::jsonb, 4, true),
  ('DDDD',    'Community Moderator', 'moderator', null, null, '{}'::jsonb, 5, true),
  ('Shawnyy', 'Community Moderator', 'moderator', null, null, '{}'::jsonb, 6, true),
  ('Madz',    'Community Moderator', 'moderator', null, null, '{}'::jsonb, 7, true)
on conflict do nothing;

-- Community handles for the members listed under their real name. Everyone else
-- already goes by their handle in display_name, so they have no separate IGN.
update public.team_members set ign = 'BigDaddyDaks' where display_name = 'Christer Saromines';
update public.team_members set ign = 'Thursday'     where display_name = 'Sheyenne Shamir Pagulayan';
update public.team_members set ign = 'Patatas'      where display_name = 'Abegail Joyce Peñafiel';
update public.team_members set ign = 'Gub'          where display_name = 'Jose Gabriel Fornier';
update public.team_members set ign = 'Gureishi'     where display_name = 'Grace Ann Tomaneng';
update public.team_members set ign = 'Rengoku'      where display_name = 'Miguel Leonido Cura';

-- Card bios.
-- DRAFT COPY: written from each member's role title alone — no one supplied
-- these. Teaching/community verbs only, no performance or outcome claims.
-- Every line needs sign-off from the person it describes before this goes live.
-- A member with a null bio_md is left off the grid entirely (see TeamGrid).
update public.team_members set bio_md = 'Runs day-to-day operations across the community, keeping programmes and schedules on track.'
  where display_name = 'Sheyenne Shamir Pagulayan';
update public.team_members set bio_md = 'Looks after the tools and platforms the community runs on, from the site to the trading utilities.'
  where display_name = 'Abegail Joyce Peñafiel';
update public.team_members set bio_md = 'Handles partnerships and collaborations with projects that share the free-education mission.'
  where display_name = 'Jose Gabriel Fornier';
update public.team_members set bio_md = 'Shapes how Mochi Web3 introduces itself, so newcomers can tell what the community offers.'
  where display_name = 'Grace Ann Tomaneng';
update public.team_members set bio_md = 'Oversees the community team and keeps moderation and education efforts aligned.'
  where display_name = 'Miguel Leonido Cura';

update public.team_members set bio_md = 'Guides members through spot and futures fundamentals in the trading channels.'
  where display_name = 'RoadToMillions' and tier = 'trading_manager';
update public.team_members set bio_md = 'Teaches position sizing and risk management, and why patience beats frequency.'
  where display_name = 'Don Kalmado' and tier = 'trading_manager';
update public.team_members set bio_md = 'Covers technical analysis basics — market structure, levels, and reading a chart.'
  where display_name = 'Ryzen' and tier = 'trading_manager';
update public.team_members set bio_md = 'Walks members through market breakdowns and the reasoning behind each setup.'
  where display_name = 'CryptoBeast' and tier = 'trading_manager';
update public.team_members set bio_md = 'Shares daily market context and helps members build a repeatable routine.'
  where display_name = 'Tope' and tier = 'trading_manager';
update public.team_members set bio_md = 'Covers derivatives mechanics and the discipline they ask of a trader.'
  where display_name = 'Arki' and tier = 'trading_manager';
update public.team_members set bio_md = 'Helps members review their own trades and turn them into a written process.'
  where display_name = 'AngCool' and tier = 'trading_manager';

update public.team_members set bio_md = 'Keeps the Discord channels tidy and points new arrivals to the right rooms.'
  where display_name = 'Tope' and tier = 'moderator';
update public.team_members set bio_md = 'Answers day-to-day questions in the help channels and onboards new members.'
  where display_name = 'Rico' and tier = 'moderator';
update public.team_members set bio_md = 'Moderates discussion and keeps conversations on topic across the server.'
  where display_name = 'Plasma' and tier = 'moderator';
update public.team_members set bio_md = 'Welcomes new members and walks them through the server rules and resources.'
  where display_name = 'Chekwa' and tier = 'moderator';
update public.team_members set bio_md = 'Watches the community channels and flags anything that needs attention.'
  where display_name = 'DDDD' and tier = 'moderator';
update public.team_members set bio_md = 'Supports members working through the beginner guides and study sessions.'
  where display_name = 'Shawnyy' and tier = 'moderator';
update public.team_members set bio_md = 'Helps run community events and keeps announcements organised.'
  where display_name = 'Madz' and tier = 'moderator';

insert into public.announcements (title, body_md, is_published, published_at) values
  (
    'Welcome to the new Mochi platform',
    E'We''ve rebuilt the Mochi hub from the ground up: curated airdrops, a real team page, and a home for trading education. More is coming in the next phases -- Learn Web3, trading tools, mentorship, and more.',
    true,
    now() - interval '2 days'
  ),
  (
    'Community guidelines refresh',
    E'We''ve updated our community guidelines ahead of the next mentorship wave. Please give them a read before posting in Discord.',
    true,
    now() - interval '6 hours'
  )
on conflict do nothing;
