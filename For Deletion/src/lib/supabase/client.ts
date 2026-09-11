import { createBrowserClient } from "@supabase/ssr";

// Not parameterized with a generated `Database` type since there's no live
// Supabase project yet. Once one exists, run `supabase gen types typescript`
// and pass the result here + in `server.ts` for full query type-safety.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
