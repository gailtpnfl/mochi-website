-- In-game name / community handle, shown under the real name on /team.
--
-- Nullable on purpose: members who go only by a handle (RoadToMillions, Tope,
-- ...) already carry it in display_name and have nothing extra to show.

alter table public.team_members
  add column if not exists ign text;
