"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PartnershipInquiryForm } from "@/components/partnership-inquiry-form";
import { Reveal } from "@/components/landing/reveal";
import { HandshakeIcon } from "@/components/landing/handshake-icon";

/**
 * Watches for "?partners=1" and opens the overlay via `onOpen`, then strips
 * the param from the URL. Copied verbatim from AboutOverlayOpener in
 * about-section.tsx — same reasoning applies here: split out because
 * useSearchParams needs a Suspense boundary, and using next/navigation's
 * reactive hooks (not window.location) means this fires on every
 * client-side navigation to "/?partners=1", including when already on "/".
 */
function PartnersOverlayOpener({ onOpen }: { onOpen: () => void }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("partners") !== "1") return;

    onOpen();

    const params = new URLSearchParams(searchParams.toString());
    params.delete("partners");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [searchParams, pathname, router, onOpen]);

  return null;
}

/**
 * The homepage's Partnership CTA, plus the /partners overlay it opens —
 * structured exactly like AboutSection (components/landing/about-section.tsx)
 * because that's what was asked for: the same open/close/reopen behavior,
 * not just a similar look.
 *
 * That means: the trigger ("Partner With Us") and the overlay live in the
 * same component and share one `useState` — clicking the button while
 * already on the homepage is a pure state flip, no navigation, so it opens
 * exactly as instantly as "Learn more about us" does. Closing is the same
 * one-liner About's close button uses (`onClick={() => setOpen(false)}`) —
 * no `router.push`, nothing to go stale, because there's nothing to
 * navigate: this overlay never leaves "/". Reopening after closing works
 * for the same reason About's does — it's the same mounted component the
 * whole time, not a route that has to remount.
 *
 * Links from other pages (the footer's "Partner With Us") go to
 * "/?partners=1", same pattern as the footer's "Our Story"/"Core Team"
 * links going to "/?about=1" — that's a real navigation to the homepage,
 * after which PartnersOverlayOpener catches the query param and opens this
 * the same way AboutOverlayOpener does for the About overlay. A direct visit
 * to /partners itself still works too, as a plain standalone page — see
 * src/app/partners/page.tsx — for bookmarks, shares, and search engines.
 */
export function PartnersSection() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Suspense fallback={null}>
        <PartnersOverlayOpener onOpen={() => setOpen(true)} />
      </Suspense>

      {/* ══════════════ PARTNERSHIP ══════════════ */}
      <section id="partnership" className="partner-cta">
        <div className="container">
          <Reveal className="partner-cta-inner">
            <div className="ptr-handshake" aria-hidden="true">
              <HandshakeIcon className="ptr-handshake-svg" />
            </div>
            <h2 className="partner-cta-title">
              We partner with{" "}
              <span className="partner-cta-highlight">the builders who get it</span> — Web3
              projects, brands, and institutions who share our mission.
            </h2>
            <p className="partner-cta-sub">
              Let&apos;s talk about what a partnership could look like — from a single campaign to a
              long-term collaboration. No pressure, just a conversation.
            </p>

            <div className="partner-cta-actions">
              <button type="button" className="btn-dark" onClick={() => setOpen(true)}>
                <span>Partner With Us</span>
                <span className="btn-icon" aria-hidden>
                  ↗
                </span>
              </button>
              <a
                href="https://calendly.com/gab-fornier"
                className="btn-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Book a Call</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <div
        id="partners-overlay"
        className={`about-overlay${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Partnership & Collaboration"
        aria-hidden={!open}
      >
        <button className="about-overlay-close" onClick={() => setOpen(false)} aria-label="Close">
          ✕
        </button>

        <div className="ao-section ao-dark ptr-hero-section">
          <Reveal className="ao-container">
            <div className="ao-hero-badge">
              <span className="badge-dot" />
              Partnership &amp; Collaboration
            </div>
            <h2 className="ao-hero-title">
              Let&apos;s <em className="ht-serif">talk.</em>
            </h2>
            <p className="ao-hero-text">
              We work with protocols, exchanges, and educators on curated airdrop listings,
              educational content, and community campaigns. We&apos;re selective — our community
              trusts our listings, and we protect that.
            </p>
          </Reveal>
        </div>

        {/* ao-dark, not ao-light — the whole Partners page is navy now, no
            white section, so this reuses the hero's own background instead
            of the light theme the rest of the "why we exist"-style sections
            (About overlay, etc.) still use. ptr-form-section trims both
            sections' default 5rem .ao-container padding down where they
            meet, since stacked back-to-back that was ~160px of dead space
            between the hero text and the form panel. */}
        <div className="ao-section ao-dark ptr-form-section">
          <div className="ao-container">
            {/* The intro copy (Get in Touch / I'd like to hear from you! /
                lede) used to sit in a left column next to the form — removed
                per request, so the form now takes the full container width
                instead of half of it. */}
            <Reveal className="partner-form-card">
              <PartnershipInquiryForm />
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
