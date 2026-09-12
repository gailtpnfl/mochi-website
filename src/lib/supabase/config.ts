/**
 * Whether a real Supabase project is actually configured.
 *
 * There is no live backend for this site yet — `.env.local` ships with a
 * `https://placeholder.supabase.co` URL and demo anon key just so local dev
 * doesn't crash on the missing-env-var check inside `@supabase/ssr`. That
 * placeholder isn't a real project: any query against it fails (there's
 * nothing there), and on a deploy where the env vars are entirely unset,
 * `createServerClient(undefined, undefined, ...)` throws immediately.
 *
 * Everything that touches Supabase (the session-refresh middleware, the
 * homepage's team-chart query, etc.) should check this first and degrade
 * gracefully — skip the session refresh, return an empty team list — rather
 * than take down the whole page. Once a real Supabase project exists, just
 * point `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` at it and
 * every consumer picks it up automatically; no code changes needed here.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return false;
  if (url.includes("placeholder.supabase.co")) return false;

  return true;
}
