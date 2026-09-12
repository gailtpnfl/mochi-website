import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Refreshes the Supabase auth session cookie on every request.
 * Called from the root `proxy.ts` (Next.js 16 renamed `middleware.ts` to `proxy.ts`).
 *
 * This runs on almost every request (see the matcher in proxy.ts), so if
 * there's no real Supabase project configured yet, skip straight through
 * instead of throwing — there's no session to refresh against a backend
 * that doesn't exist, and without this guard every single page load (not
 * just auth-gated ones) would crash.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Required: this refreshes the session and must not be removed.
  await supabase.auth.getUser();

  return response;
}
