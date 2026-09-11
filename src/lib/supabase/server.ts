import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Not parameterized with a generated `Database` type since there's no live
// Supabase project yet. Once one exists, run `supabase gen types typescript`
// and pass the result here + in `client.ts` for full query type-safety.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // setAll called from a Server Component; safe to ignore
            // because the proxy refreshes the session on every request.
          }
        },
      },
    },
  );
}
