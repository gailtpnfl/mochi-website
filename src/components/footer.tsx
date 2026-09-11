import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { NewsletterForm } from "@/components/newsletter-form";
import { isRouteVisible, SHOW_MERCH_LINK } from "@/lib/site-visibility";

const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/ZGJm8vKUbz";

/** Outline-style social icons (no icon package dependency), matching the
 * stroke-based glyphs used for the Core Team socials — replaces the old
 * emoji glyphs (𝕏 💬 ✈️ 📘), which rendered inconsistently across
 * platforms and didn't read as "icons" at a glance. */
const SOCIAL_ICONS: Record<string, ReactNode> = {
  X: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l7.2 9.4L3.3 21H5.6l6.02-6.6L16.5 21H21l-7.55-9.86L20.4 3h-2.3l-5.5 6-4.6-6H3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
  Discord: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 8.5c1.4-.9 3.1-1.4 5-1.4s3.6.5 5 1.4c1.4 2 2 4.6 1.8 7.3-1.5 1.1-3 1.7-4.4 2-.3-.5-.6-1-.8-1.5.5-.2 1-.4 1.4-.7-.1-.1-.2-.2-.3-.3-2.6 1.2-5.4 1.2-8 0-.1.1-.2.2-.3.3.4.3.9.5 1.4.7-.2.5-.5 1-.8 1.5-1.4-.3-2.9-.9-4.4-2C5 13.1 5.6 10.5 7 8.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="9.5" cy="13" r="1" fill="currentColor" />
      <circle cx="14.5" cy="13" r="1" fill="currentColor" />
    </svg>
  ),
  Telegram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 2 11 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M22 2 15 22l-4-9-9-4 20-7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
  Facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 21v-7.2h2.4l.4-3.1H14V8.8c0-.9.25-1.5 1.55-1.5H17V4.5c-.3 0-1.28-.1-2.42-.1-2.4 0-4.03 1.46-4.03 4.15v2.15H8v3.1h2.55V21H14Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const SOCIALS = [
  { label: "Discord", href: DISCORD_URL },
  {
    label: "Telegram",
    href: "https://t.me/mochiweb3?fbclid=IwY2xjawULY3FwZG9mAWV4dG4DYWVtAjEwAGJyaWQRMWpiTks2am5oUld2dWd4aFZzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEeGHPaD8_NqocCvM4ictqKSWoBP6JEarVBW01kktwmK00Gfxh9ZBo3yHJkVJk_aem_6d5INIzdHx1P0K6sSq6bnA",
  },
  { label: "Facebook", href: "https://www.facebook.com/mochiweb3" },
];

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  /** External store link — gated with the on-page Merch section, not by route. */
  merch?: boolean;
}

const FOOTER_COLUMNS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Learn",
    links: [
      { label: "Learn Web3", href: "/learn" },
      { label: "Airdrop Guides", href: "/airdrops" },
      { label: "Mentorship", href: "/mentorship" },
      { label: "Trading Journal", href: "/journal" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our Story", href: "/?about=1" },
      { label: "Core Team", href: "/?about=1" },
      { label: "Job Opportunities", href: "/jobs" },
      // Same pattern as "Our Story"/"Core Team" above — opens the
      // homepage's Partnership overlay (partners-section.tsx) via the
      // "?partners=1" query param rather than linking straight to the
      // standalone /partners page, so it behaves like the About overlay
      // from every page, not just the homepage.
      { label: "Partner With Us", href: "/?partners=1" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Discord", href: DISCORD_URL, external: true },
      { label: "Community", href: "/community" },
      { label: "NFT Collections", href: "/nft" },
      {
        label: "Community Merch",
        href: process.env.NEXT_PUBLIC_MERCH_URL || "#",
        external: true,
        merch: true,
      },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "BigBoss Calculator", href: "/tools/bigboss-calculator" },
      { label: "FVG Indicator", href: "/tools/fvg-indicator" },
      { label: "Watchlist", href: "/tools/watchlist" },
      { label: "TradingView", href: "/tradingview" },
    ],
  },
];

/** External links always survive; internal ones go through the soft-launch gate. */
function linkVisible(link: FooterLink): boolean {
  if (link.merch) return SHOW_MERCH_LINK;
  if (link.external) return true;
  return isRouteVisible(link.href);
}

// "Learn" and "Tools" columns hidden per request — kept in FOOTER_COLUMNS
// above (rather than deleted) so they're a one-line change to bring back.
const HIDDEN_COLUMNS = new Set(["Learn", "Tools"]);

// A column whose links are all hidden is dropped rather than left as a bare heading.
const VISIBLE_COLUMNS = FOOTER_COLUMNS.filter((col) => !HIDDEN_COLUMNS.has(col.heading))
  .map((col) => ({
    ...col,
    links: col.links.filter(linkVisible),
  }))
  .filter((col) => col.links.length > 0);

const LEGAL_LINKS = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Community", href: "/community" },
].filter((l) => isRouteVisible(l.href));

export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link href="/" className="nav-logo">
              <Image src="/images/mw-logo.png" alt="Mochi Web3" width={40} height={40} />
              <span className="brand-word">Mochi Web3</span>
            </Link>
            <p>
              Free Web3 education for everyone. Spot &amp; futures trading, airdrop hunting, and
              navigating the ecosystem — built by the community, for the community.
            </p>
            <div className="footer-socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="ft-soc"
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                >
                  <span>{SOCIAL_ICONS[s.label]}</span>
                </a>
              ))}
            </div>
            <div className="footer-newsletter">
              <p className="footer-newsletter-label">Stay in the loop</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Wrapped (rather than left as direct grid children) so the
              visible columns — just Company and Community now that
              Learn/Tools are hidden — can be pushed together to the right
              edge of the row instead of trailing the brand column with a
              big empty gap after them. See .footer-nav-cols in chrome.css. */}
          <div className="footer-nav-cols">
            {VISIBLE_COLUMNS.map((col) => (
              <div key={col.heading} className="footer-col">
                <h4>{col.heading}</h4>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer">
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href}>{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="footer-disclaimer">
          Mochi Web3 is for education and community purposes only. Nothing on this site —
          including airdrop guides, watchlists, indicators, or trading tools — constitutes
          financial, investment, or trading advice. Web3 and crypto assets carry risk, including
          total loss. Always do your own research.
        </p>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Mochi Web3. All rights reserved.</p>
          <div className="footer-legal">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Pinned to the very bottom edge of <footer> and cropped by its
          overflow:hidden — matches projectone.website's footer wordmark,
          which sits glued to the bottom of the page with its lower half cut
          off, behind (not between) the disclaimer and copyright row. */}
      <div className="footer-watermark">Mochi Web3</div>
    </footer>
  );
}
