import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { isRouteVisible } from "@/lib/site-visibility";

export function proxy(request: NextRequest) {
  // Soft launch: bounce anything outside the published set before touching
  // Supabase. The session refresh is skipped for these requests, which is fine
  // — the redirect target runs it on the next hop.
  if (!isRouteVisible(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
