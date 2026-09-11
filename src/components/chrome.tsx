"use client";

import { usePathname } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

/**
 * Routes that should render edge-to-edge with no site Nav/Footer around
 * them — same idea as the `/?about=1` overlay (which covers the Nav with a
 * fixed full-viewport panel), but for a real routed page instead of a modal.
 *
 * /partners briefly became an intercepted-route modal layered over whatever
 * page you were on, so its close could feel as instant as the About
 * overlay's. That's reverted — it broke the homepage twice (a scroll lock
 * that outlived the modal, then a stuck close button on reopen), both from
 * relying on parallel-route unmount/remount guarantees Next.js doesn't
 * actually make, and there was no way to verify a fix live in this
 * environment. /partners is back to being a plain, predictable standalone
 * route again; see partners-overlay-shell.tsx for how its close works now.
 *
 * /mentorship uses the same treatment — see mentorship-overlay-shell.tsx —
 * so it matches /partners' look (dark hero + form panel, no site chrome
 * around it, a round ✕ close button instead of the Nav/Footer).
 */
const FULLSCREEN_ROUTES = ["/partners", "/mentorship"];

export function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (FULLSCREEN_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
