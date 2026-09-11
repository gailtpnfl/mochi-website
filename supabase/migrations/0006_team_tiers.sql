-- Team hierarchy for the /team org chart.
--
-- The page groups members into tiers (founder -> leadership -> trading_manager
-- -> director -> moderator). `position` still orders members *within* a tier.

alter table public.team_members
  add column if not exists tier text not null default 'moderator';

alter table public.team_members
  drop constraint if exists team_members_tier_check;

alter table public.team_members
  add constraint team_members_tier_check
  check (tier in ('founder', 'leadership', 'trading_manager', 'director', 'moderator'));

create index if not exists team_members_tier_idx on public.team_members (tier, position);

-- Backfill rows that predate the column, so nobody silently lands in Moderators.
update public.team_members set tier = 'founder'
  where tier = 'moderator' and role_title ilike '%founder%';

update public.team_members set tier = 'leadership'
  where tier = 'moderator' and (role_title ilike 'c%o' or role_title ilike '%chief%');

update public.team_members set tier = 'director'
  where tier = 'moderator' and role_title ilike '%director%';

update public.team_members set tier = 'trading_manager'
  where tier = 'moderator' and (role_title ilike '%trading%' or role_title ilike '%mentor%');
