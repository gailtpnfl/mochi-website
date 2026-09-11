-- RLS policies only filter rows; PostgREST still requires base object-level
-- GRANTs on the underlying tables/sequences/functions for the `anon` and
-- `authenticated` roles, or every request 401s with "permission denied"
-- before RLS is ever evaluated. Grant broadly here and let RLS do the
-- actual row-level restriction (this matches what a fresh Supabase-hosted
-- project pre-applies automatically; a self-authored schema needs it explicit).

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on routines to anon, authenticated, service_role;
