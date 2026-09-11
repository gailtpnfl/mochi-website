import type { Metadata } from "next";
import { Suspense } from "react";
import { MentorshipOverlayShell } from "@/components/mentorship-overlay-shell";
import { MentorshipContent } from "./mentorship-content";

export const metadata: Metadata = {
  title: "Mentorship Application",
  description: "Apply for a Mochi mentorship wave.",
};

/**
 * Skeleton shown while MentorshipContent's Supabase queries (cohort, user,
 * application, sessions) are still in flight. Same .mw-card shape as the
 * real content so it doesn't jump around when the real content swaps in —
 * just pulses in place.
 */
function MentorshipContentSkeleton() {
  return (
    <div className="mw-card p-6">
      <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
      <div className="mt-4 h-3 w-full animate-pulse rounded bg-white/5" />
      <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-white/5" />
    </div>
  );
}

export default function MentorshipPage() {
  return (
    // Same visual system as /partners (components/landing/about-section.tsx's
    // ao-dark overlay theme): mw-landing scope, a dark ao-hero with the badge
    // + big serif-accented title, then a dark form panel — reused here so
    // Mentorship reads as the same product as Partnership instead of the
    // plainer, generic "app page" look it had before. MentorshipOverlayShell
    // (same pattern as PartnersOverlayShell) swaps the site Nav/Footer for a
    // full-screen dark panel with its own round ✕ close button — see
    // chrome.tsx's FULLSCREEN_ROUTES, which includes "/mentorship".
    //
    // This page itself is no longer async and awaits nothing — the hero
    // below paints immediately on navigation. Only MentorshipContent (the
    // cohort/application/sessions data, in mentorship-content.tsx) depends
    // on Supabase queries, so it's wrapped in <Suspense> and streams in
    // separately instead of blocking the whole page behind those queries.
    // That's what was making "Apply for mentorship" feel slow to open next
    // to "Partner With Us", which has no data to fetch at all.
    <div className="mw-landing">
      <MentorshipOverlayShell>
        <div className="ao-section ao-dark ptr-hero-section">
          <div className="ao-container">
            <div className="ao-hero-badge">
              <span className="badge-dot" />
              Mentorship
            </div>
            <h1 className="ao-hero-title">
              Guided <em className="ht-serif">learning.</em>
            </h1>
            <p className="ao-hero-text">
              Small-group mentorship cohorts (&quot;Waves&quot;) covering risk management, chart
              reading, and trade review with a mentor.
            </p>
          </div>
        </div>

        {/* ao-dark, not ao-light — matches /partners' single-navy-background
            treatment rather than breaking into a light section here. */}
        <div className="ao-section ao-dark ptr-form-section">
          <div className="ao-container">
            {/* partner-form-card repaints any nested .mw-card (the cohort
                card, status card, session cards, and the application form
                below) to the same solid-navy panel look the Partnership form
                uses, instead of the default translucent-on-page card. */}
            <div className="partner-form-card flex flex-col gap-6">
              <Suspense fallback={<MentorshipContentSkeleton />}>
                <MentorshipContent />
              </Suspense>
            </div>
          </div>
        </div>
      </MentorshipOverlayShell>
    </div>
  );
}
