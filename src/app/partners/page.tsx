import type { Metadata } from "next";
import { PartnershipInquiryForm } from "@/components/partnership-inquiry-form";
import { PartnersOverlayShell } from "@/components/partners-overlay-shell";

export const metadata: Metadata = {
  title: "Partnership & Collaboration",
  description: "Partner with Mochi Web3 on airdrops, education, or community campaigns.",
};

/**
 * "/about" theme: same visual system as the About overlay
 * (components/landing/about-section.tsx) rather than the homepage's
 * Partnership CTA gradient block — mw-landing scope, a dark ao-hero with the
 * badge + big serif-accented title, then an ao-light section reusing the
 * "Why We Exist" quote/body split for Book a Call / Send an Inquiry.
 *
 * PartnersOverlayShell wraps all of it in the same `.about-overlay` panel +
 * close button the About overlay uses — see that component for how closing
 * works, and why this is a plain standalone route rather than a modal
 * layered over another page.
 */
export default function PartnersPage() {
  return (
    <div className="mw-landing">
      <PartnersOverlayShell>
        {/* Plain divs, not <section> — matches the About overlay's own DOM
            exactly. A bare `.mw-landing section { padding: 100px 0; }` rule
            targets the <section> tag itself, so using real <section>s here
            stacked that padding on top of .ao-container's own 5rem, roughly
            doubling the hero's vertical padding versus the overlay it's meant
            to mirror. */}
        <div className="ao-section ao-dark ptr-hero-section">
          <div className="ao-container">
            <div className="ao-hero-badge">
              <span className="badge-dot" />
              Partnership &amp; Collaboration
            </div>
            <h1 className="ao-hero-title">
              Let&apos;s <em className="ht-serif">talk.</em>
            </h1>
            <p className="ao-hero-text">
              We work with protocols, exchanges, and educators on curated airdrop listings,
              educational content, and community campaigns. We&apos;re selective — our community
              trusts our listings, and we protect that.
            </p>
          </div>
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
            <div className="partner-form-card">
              <PartnershipInquiryForm />
            </div>
          </div>
        </div>
      </PartnersOverlayShell>
    </div>
  );
}
