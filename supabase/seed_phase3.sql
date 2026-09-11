-- Phase 3 seed: one open mentorship cohort, 2 job postings.
-- Run after seed_phase2.sql.

insert into public.cohorts (id, name, description_md, status, starts_at, ends_at) values
  (
    '44444444-4444-4444-4444-444444444444',
    'Wave 5',
    E'An 8-week mentorship cohort covering risk management, chart reading, and trade review. Small groups, weekly sessions (Manila time), and 1:1 trade reviews with a mentor.',
    'upcoming',
    current_date + interval '14 days',
    current_date + interval '70 days'
  )
on conflict (id) do nothing;

insert into public.job_postings (slug, title, org, type, location, description_md, apply_url, status) values
  (
    'community-moderator',
    'Community Moderator',
    'Mochi Agency',
    'part_time',
    'Remote',
    E'Help keep the Discord safe and welcoming: onboarding new members, flagging scam links, and supporting the mentorship cohorts.\n\n**What we''re looking for**\n- Active in the Mochi community already\n- Good judgment under pressure (scam links move fast)\n- A few hours a week, flexible schedule',
    'mailto:jobs@mochiworld.example?subject=Community%20Moderator',
    'open'
  ),
  (
    'content-writer',
    'Content Writer — Airdrop Guides',
    'Mochi Agency',
    'contract',
    'Remote',
    E'Write clear, accurate step-by-step guides for new airdrop listings. Web3-native, comfortable verifying official sources before publishing.',
    'mailto:jobs@mochiworld.example?subject=Content%20Writer',
    'open'
  )
on conflict (slug) do nothing;
