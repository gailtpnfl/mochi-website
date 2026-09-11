"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

/**
 * Wraps /partners' content in the exact same `.about-overlay` panel the
 * About overlay (components/landing/about-section.tsx) uses — same
 * slide-transform panel, same round ✕, same close handler shape: About's ✕
 * is `onClick={() => setOpen(false)}`, one synchronous state flip and
 * nothing else. This does the same thing; the only addition is a
 * `router.push("/")` in that same synchronous click handler, since
 * /partners has a URL that needs to change too, which the About overlay's
 * in-place `useState` never had to deal with.
 *
 * /partners is a real, standalone route (src/app/partners/page.tsx) — an
 * earlier version made it an intercepted-route modal layered over whatever
 * page you were on, specifically to get its close as instant as the About
 * overlay's (no unmount/remount of a heavy homepage). That's reverted: it
 * broke the homepage twice — first a scroll lock that outlived the "closed"
 * modal, then a permanently-stuck close button on reopening — both from
 * Next.js parallel routes not actually guaranteeing the unmount/remount
 * this component was built around, and there was no way to verify a fix
 * live in this environment. A plain route means every open is a fresh
 * mount and every close is a real, total unmount — no state can survive
 * between visits to get stale, which is what both bugs came from. The
 * trade-off is this can't be *quite* as instant as the About overlay
 * (there's a real page swap under the hood), but it can't half-break the
 * site either.
 *
 * The overlay mounts already `is-open` — no slide-IN on page load, since a
 * visitor lands on /partners as a normal page view, not by toggling it open
 * from an already-visible homepage the way the About overlay is.
 *
 * Closing always lands on plain "/", never `router.back()`. Visitors reach
 * /partners from more than one place — the footer's "Partner With Us" link,
 * the homepage's Partnership CTA button, or a direct link — and whichever
 * homepage entry is one history step back can itself be a scroll-anchor
 * (e.g. "/#partnership", since that's also where the homepage nav's own
 * "Partnership" link points). `back()` would land there and jump straight
 * back down to that section instead of the plain homepage top, which reads
 * as the close button not actually closing.
 */
export function PartnersOverlayShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const closingRef = useRef(false);

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleClose() {
    if (closingRef.current) return;
    closingRef.current = true;
    setOpen(false);
    document.body.style.overflow = "";
    router.push("/");
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // handleClose is intentionally not in the deps array — it's stable
    // enough here (only closes over router/refs) and re-adding the listener
    // on every render isn't worth chasing for a single Escape handler.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`about-overlay${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Partnership & Collaboration"
    >
      <button type="button" onClick={handleClose} className="about-overlay-close" aria-label="Close">
        ✕
      </button>
      {children}
    </div>
  );
}
