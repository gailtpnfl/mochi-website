import Image from "next/image";
import Link from "next/link";
import { Suspense, type CSSProperties } from "react";
import { AboutSectionData } from "@/components/landing/about-section-data";
import { EventsShowcase, type ShowcaseEvent } from "@/components/landing/events-showcase";
import { OfferSlider } from "@/components/landing/offer-slider";
import { PartnersSection } from "@/components/landing/partners-section";
import { Reveal } from "@/components/landing/reveal";
import { ScrollProgress } from "@/components/landing/scroll-progress";
import { Testimonials } from "@/components/sections/Testimonials";
import { isRouteVisible, LANDING_SECTIONS, SOFT_LAUNCH } from "@/lib/site-visibility";

const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/ZGJm8vKUbz";
const MERCH_URL = process.env.NEXT_PUBLIC_MERCH_URL || "#";

const HERO_STATS = [
  { num: "30K+", label: "Members" },
  { num: "100%", label: "Free Education" },
  { num: "3+", label: "Years Active" },
];


/** Full-bleed claims strip, right under the hero — see .claims-marquee in
 * landing.css. Duplicated once when rendered (the keyframe translates
 * -50%, so the second copy scrolls in seamlessly as the first leaves),
 * same pattern as the testimonials ticker. */
const CLAIMS = [
  "Free Web3 Education",
  "No Paid Signals",
  "30,000+ Members",
  "No Gatekeeping",
  "Community-Driven",
  "Real Traders, Real Results",
];

const OPPORTUNITIES = [
  {
    icon: "🪂",
    title: "Airdrop Hunting",
    body: "Vetted, step-by-step guides to earn from high-potential crypto airdrops — no scams, no noise, just real opportunities with free guides.",
    href: "/airdrops",
  },
  {
    icon: "💼",
    title: "Job Opportunities",
    body: "Looking to contribute to the Mochi Web3 ecosystem? We're always searching for passionate community mods, researchers, and creators.",
    href: "/jobs",
  },
  {
    icon: "📡",
    title: "Community Alpha",
    body: "Get early project calls, market signals, and exclusive insights shared daily by our mentors and analysts inside the Discord.",
    href: "/community",
  },
];

const MERCH = [
  {
    emoji: "👕",
    title: "Mochi Hoodie",
    body: "Premium heavyweight hoodie with embroidered Mochi logo. Limited first drop.",
  },
  {
    emoji: "🧢",
    title: "Mochi Cap",
    body: "Structured snapback with Mochi emblem. Multiple colorways available.",
  },
  {
    emoji: "👕",
    title: "Trader Tee",
    body: "Graphic tee with Mochi trading motifs. 100% cotton, oversized fit.",
  },
];

const NFTS = [
  {
    emoji: "🍡",
    title: "Mochi Genesis",
    body: "The original collection. 1,000 unique Mochi characters granting lifetime Discord access and priority mentorship.",
    meta: "Supply: 1,000",
    status: { label: "Upcoming", className: "status-new" },
    gradient: "linear-gradient(135deg,var(--accent3),var(--teal))",
  },
  {
    emoji: "🏯",
    title: "Mochi City Passes",
    body: "Access pass for Mochi Crypto City — the virtual trading hub. Holders get early feature access and exclusive tools.",
    meta: "Supply: 5,000",
    status: { label: "Upcoming", className: "status-new" },
    gradient: "linear-gradient(135deg,var(--teal),var(--accent))",
  },
  {
    emoji: "📈",
    title: "Trader Badges",
    body: "Soul-bound achievement NFTs awarded to members who complete education milestones. Non-transferable proof of knowledge.",
    meta: "Soulbound",
    status: { label: "● Active", className: "status-live" },
    gradient: "linear-gradient(135deg,#f472b6,var(--accent3))",
  },
];

/** Display names, as given. `photo` is set once a real avatar for that
 * trader lands in public/images/funded-traders — the rest still fall back
 * to the placeholder sample art below. */
const FUNDED_HIGHLIGHTS: { name: string; photo?: string }[] = [
  { name: "aoii_kaoo", photo: "/images/funded-traders/aoii_kaoo.webp" },
  { name: "LowKEY_per_keyLOW", photo: "/images/funded-traders/lowkey_per_keylow.webp" },
  { name: "Lonewolf", photo: "/images/funded-traders/lonewolf.webp" },
  { name: "Nostalgia22", photo: "/images/funded-traders/nostalgia22.webp" },
  { name: "Red", photo: "/images/funded-traders/red.webp" },
  { name: "Zach", photo: "/images/funded-traders/zach.webp" },
  { name: "Derrice", photo: "/images/funded-traders/derrice.webp" },
  { name: "OwO", photo: "/images/funded-traders/owo.webp" },
];

function FundFrame({ name, photo }: { name: string; photo?: string }) {
  return (
    <div className="fund-frame">
      <div className="fund-frame-avatar">
        {/* PLACEHOLDER sample art renders until a real photo is supplied —
            see FUNDED_HIGHLIGHTS above. */}
        <Image src={photo ?? "/images/funded-sample-avatar.webp"} alt="" width={320} height={320} />
      </div>
      <div className="fund-frame-name">{name}</div>
    </div>
  );
}

/** Drifting "spark" background for Events & Participations — same rising-dot
 * recipe as Community Wins' `.ml-spark` (community-stats via Testimonials.tsx),
 * reused here in place of the section's old traveling dashed route line.
 * Fixed, hand-picked positions/timings rather than Math.random() to avoid a
 * server/client hydration mismatch. See .ev-spark rules in landing.css. */
const EVENT_SPARKS: { left: string; size: number; duration: string; delay: string; hue: "accent" | "teal" }[] = [
  { left: "6%", size: 7, duration: "10s", delay: "0.4s", hue: "teal" },
  { left: "15%", size: 6, duration: "12.5s", delay: "3.1s", hue: "accent" },
  { left: "24%", size: 9, duration: "9.5s", delay: "6.2s", hue: "teal" },
  { left: "33%", size: 6, duration: "11.5s", delay: "1.6s", hue: "accent" },
  { left: "42%", size: 7, duration: "13s", delay: "4.8s", hue: "teal" },
  { left: "51%", size: 9, duration: "10.5s", delay: "0s", hue: "accent" },
  { left: "60%", size: 6, duration: "12s", delay: "7.3s", hue: "teal" },
  { left: "69%", size: 7, duration: "9s", delay: "2.7s", hue: "accent" },
  { left: "78%", size: 6, duration: "11s", delay: "5.5s", hue: "teal" },
  { left: "87%", size: 9, duration: "13.5s", delay: "1.1s", hue: "accent" },
  { left: "94%", size: 7, duration: "10s", delay: "8s", hue: "teal" },
];

// PLACEHOLDER: `src` stands in for the reference's empty <image-slot>, and the
// dates/roster are sample events — swap in the real list and photos once
// they're confirmed. `boldPart` names the substring of `caption` to render
// in bold (must match exactly). The 1st Mochiversary deliberately shows no
// exact date — members-only event, kept vague on the public site so it
// doesn't invite gate-crashers.
const EVENTS: ShowcaseEvent[] = [
  {
    title: "1st Mochiversary",
    date: "November 2026",
    caption:
      "A fun overnight event in Davao marking one year of Mochi Web3 — exclusive to Mochi Web3 members, with details shared closer to the date.",
    boldPart: "exclusive to Mochi Web3 members",
    status: "upcoming",
    src: "/images/events/mochiversary.webp",
    alt: "1st Mochiversary graphic",
  },
  // Completed events are listed newest-first (August → March) — the
  // "Completed" tab shows them in this same array order (EventsShowcase just
  // filters by status, it doesn't re-sort), so this order is what renders.
  {
    title: "Alpha Arena 2026",
    date: "August 2026",
    caption:
      "140+ traders competed online for a spot in the final round in Bali, Indonesia — our team stayed disciplined instead of chasing rankings. All 8 Mochi Web3 mentors and analysts who joined placed among the top finishers.",
    boldPart: "stayed disciplined",
    status: "completed",
    src: "/images/events/alpha-arena-2026.webp",
    alt: "Mochi Web3 traders at Alpha Arena 2026",
  },
  {
    title: "Community Outreach in Gensan",
    date: "June 2026",
    caption:
      "In partnership with MEXC Ventures, Mochi Web3 provided relief assistance to the people of Brgy. Bawing, Siguel, General Santos City affected by the earthquake.",
    boldPart: "MEXC Ventures",
    status: "completed",
    src: "/images/events/gensan-outreach.webp",
    alt: "Gensan community outreach photo",
  },
  {
    title: "Manila Meetup",
    date: "April 2026",
    caption: "A simple dinner meetup where Manila-based members got together to connect in person.",
    boldPart: "connect in person",
    status: "completed",
    src: "/images/events/manila-meetup.webp",
    alt: "Manila Meetup photo",
  },
  {
    title: "Davao Summer Meet",
    date: "March 2026",
    caption: "An overnight bonding trip for members to get to know each other, hosted in Davao City.",
    boldPart: "Davao City",
    status: "completed",
    src: "/images/events/davao-summer-meet.webp",
    alt: "Davao Summer Meet photo",
  },
];


// No longer async, and awaits nothing directly — the hero below now paints
// immediately on navigation instead of waiting on the team-roster query.
// That query moved into AboutSectionData (about-section-data.tsx), which
// renders behind a <Suspense> boundary further down, since the org chart it
// feeds is inside the About overlay (closed by default, nothing above the
// fold needs it). This is what was making it feel slow to land back on "/"
// after closing the Partnership or Mentorship overlays — the whole homepage
// used to wait on this query before rendering anything at all.
export default function HomePage() {
  return (
    <div className="mw-landing">
      <ScrollProgress />

      {/* ══════════════ HERO ══════════════ */}
      <section className="hero" id="home">
        <div className="hero-dots" />
        <div className="hero-glow-bg" />
        <div className="hero-mesh" />
        <div className="hero-inner">
          <div className="hero-inner-grid">
            <div className="hero-left">
              <div className="hero-badge">
                <span className="badge-dot" />
                <span>Web3 Education — Free, Forever</span>
              </div>
              <h1>
                Master Web3.
                <br />
                <em className="ht-serif">Explore Crypto.</em>
                <br />
                Build your Future.
              </h1>
              <p className="hero-sub">
                Mochi Web3 breaks down blockchain so you can trade smarter, grab airdrops, and grow
                your wealth — no paywalls, no gatekeeping, no hidden fees.
              </p>
              {/* Soft launch gates /learn and /airdrops, and /airdrops can
                  also be hidden on its own (Opportunities), so check route
                  visibility directly rather than just the soft-launch flag —
                  otherwise this would keep linking to a redirect. */}
              <div className="hero-actions">
                {SOFT_LAUNCH ? (
                  <a
                    href={DISCORD_URL}
                    className="btn-dark"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Join Our Discord</span>
                    <span className="btn-icon">↗</span>
                  </a>
                ) : (
                  <>
                    {/* Points at Discord instead of /learn per request, same
                        as the "Start learning" CTA in the offer-slider panel
                        below and the other "Join Our Discord" links on the
                        site. */}
                    <a href={DISCORD_URL} className="btn-dark" target="_blank" rel="noopener noreferrer">
                      <span>Start Learning</span>
                      <span className="btn-icon">↗</span>
                    </a>
                    {isRouteVisible("/airdrops") && (
                      <Link href="/airdrops" className="btn-outline">
                        <span>Explore Airdrops</span>
                      </Link>
                    )}
                  </>
                )}
              </div>
              <div className="hero-stats">
                {HERO_STATS.map((s) => (
                  <div className="hero-stat" key={s.label}>
                    <span className="num">{s.num}</span>
                    <span className="label">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="scroll-indicator">
                <div className="scroll-mouse">
                  <div className="scroll-dot" />
                </div>
                <span>Scroll</span>
              </div>
            </div>

            <div className="orb-stage">
              <div className="orb-ring" />
              <div className="orb-ring r2" />
              <div className="hexglow">
                <Image src="/images/mw-logo.png" alt="Mochi Web3 crest" width={300} height={300} priority />
              </div>
              <div className="orb-chip c1">
                <span className="ic" style={{ background: "rgba(94,224,160,.16)" }}>
                  🎯
                </span>
                <div>
                  <span>Quest complete</span>
                  <small>+250 pts</small>
                </div>
              </div>
              <div className="orb-chip c2">
                <span className="ic" style={{ background: "rgba(78,155,255,.16)" }}>
                  🪂
                </span>
                <div>
                  <span>New airdrop</span>
                  <small>ZkVault live</small>
                </div>
              </div>
              <div className="orb-chip c3">
                <span className="ic" style={{ background: "rgba(166,107,240,.18)" }}>
                  ✅
                </span>
                <div>
                  <span>Guide verified</span>
                  <small>by Mochi team</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CLAIMS MARQUEE ══════════════ */}
      <div className="claims-marquee" aria-hidden="true">
        <div className="claims-track">
          {[...CLAIMS, ...CLAIMS].map((claim, i) => (
            <span className="claims-item" key={i}>
              {claim}
              <span className="claims-dot">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════ OUR STORY (+ about overlay) ══════════════ */}
      <Suspense fallback={null}>
        <AboutSectionData />
      </Suspense>

      {/* ══════════════ WHAT WE OFFER SLIDER ══════════════ */}
      <OfferSlider />

      {/* ══════════════ OPPORTUNITIES ══════════════ */}
      {LANDING_SECTIONS.opportunities && (
      <section id="airdrops" className="v2-light">
        <div className="container">
          <Reveal className="opp-header">
            <div className="opp-header-left">
              <div className="section-eyebrow">
                <span className="badge-dot" /> Opportunities
              </div>
              <h2 className="opp-title">
                The right Web3 opportunity
                <br />
                <em className="ht-serif">for your journey.</em>
              </h2>
            </div>
            <div className="opp-header-right">
              <p>
                From airdrop hunting to community careers and exclusive alpha — find the opportunity
                that fits where you are in your Web3 journey.
              </p>
            </div>
          </Reveal>

          <Reveal className="opp-cards">
            {OPPORTUNITIES.map((o) => (
              <Link href={o.href} className="opp-card" key={o.title}>
                <div className="opp-card-icon">{o.icon}</div>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
      )}

      {/* ══════════════ COMMUNITY MERCH ══════════════ */}
      {LANDING_SECTIONS.merch && (
      <section id="merch" className="v2-dark">
        <div className="container">
          <Reveal className="v2-section-head">
            <div className="section-eyebrow">
              <span className="badge-dot" />
              Merch
            </div>
            <h2 className="section-title">
              Community <em className="ht-serif">Merch</em>
            </h2>
            <p className="section-sub">
              Represent the Mochi community. Limited drops, exclusive designs, built for the
              culture.
            </p>
          </Reveal>

          <Reveal className="merch-grid">
            {MERCH.map((m) => (
              <div className="merch-card" key={m.title}>
                {/* PLACEHOLDER: emoji stands in for real product photography */}
                <div className="merch-img">{m.emoji}</div>
                <div className="merch-info">
                  <h3>{m.title}</h3>
                  <p>{m.body}</p>
                  <div className="merch-status">
                    <span className="status-chip status-new">Coming Soon</span>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal style={{ marginTop: "2rem", textAlign: "center" }}>
            <a href={MERCH_URL} className="btn-outline" target="_blank" rel="noopener noreferrer">
              <span>Visit the Shop</span>
            </a>
          </Reveal>
        </div>
      </section>
      )}

      {/* ══════════════ NFT COLLECTIONS ══════════════ */}
      {LANDING_SECTIONS.nft && (
      <section id="nft" className="v2-light">
        <div className="container">
          <Reveal className="v2-section-head">
            <div className="section-eyebrow">
              <span className="badge-dot" />
              NFTs
            </div>
            <h2 className="section-title">
              NFT Community <em className="ht-serif">Collections</em>
            </h2>
            <p className="section-sub">
              Community-owned NFT collections that unlock exclusive Mochi Web3 perks, access, and
              identity on-chain.
            </p>
          </Reveal>

          <Reveal className="nft-grid">
            {NFTS.map((n) => (
              <div className="nft-card" key={n.title}>
                {/* PLACEHOLDER: gradient + emoji stand in for real collection artwork */}
                <div className="nft-img" style={{ background: n.gradient }}>
                  <span className="nft-emoji">{n.emoji}</span>
                </div>
                <div className="nft-info">
                  <h3>{n.title}</h3>
                  <p>{n.body}</p>
                  <div className="nft-meta">
                    <span>{n.meta}</span>
                    <span className={`status-chip ${n.status.className}`}>{n.status.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link href="/nft" className="btn-dark">
              <span>Explore Collections</span>
              <span className="btn-icon">↗</span>
            </Link>
          </Reveal>
        </div>
      </section>
      )}

      {/* ══════════════ COMMUNITY LOVE ══════════════ */}
      {/* The marquee of invented quotes was replaced by the real survey
          responses in src/data/testimonials.ts. The `community-love` id is kept
          so existing anchors still resolve. */}
      {LANDING_SECTIONS.testimonials && <Testimonials />}

      {/* Curved divider — Community Wins (dark #050f1e, #community-stats,
          rendered inside <Testimonials />) into Funded Traders (light,
          #f9f8f5) — a cream dome rising out of the dark section, per the
          projectone.website reference. The dome is a true circular arc (an
          SVG path, not the old stretched-ellipse div) so it reads as an
          actual curve rather than a squashed oval. See .section-curve in
          landing.css for the arc math and the fluid vw height that keeps
          the viewBox's aspect ratio matching the rendered box exactly (so
          the arc is never distorted). */}
      {LANDING_SECTIONS.testimonials && LANDING_SECTIONS.funded && (
        <div className="section-curve section-curve--to-light" aria-hidden="true">
          <svg
            className="section-curve-svg"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
          >
            <path d="M0,100 A1300,1300 0 0,1 1000,100 Z" />
          </svg>
        </div>
      )}

      {/* ══════════════ FUNDED TRADERS ══════════════ */}
      {LANDING_SECTIONS.funded && (
      <section id="funded" className="v2-light">
        <div className="container">
          <Reveal className="v2-section-head">
            <div className="section-eyebrow">
              <span className="badge-dot" />
              Funded & Growing
            </div>
            <h2 className="section-title">
              Funded <em className="ht-serif">Traders</em>
            </h2>
            <p className="section-sub">
              Members who passed their evaluations and now trade funded capital — after learning the
              process here, for free.
            </p>
          </Reveal>

          {/* One row, grayscale photos, drifting left-to-right on a loop —
              duplicated once so the loop is seamless (same technique as the
              ticker in Community Testimonials). Pauses on hover. */}
          <Reveal className="fund-marquee">
            <div className="fund-marquee-row">
              <div className="fund-marquee-track">
                {[...FUNDED_HIGHLIGHTS, ...FUNDED_HIGHLIGHTS].map((t, i) => (
                  <FundFrame name={t.name} photo={t.photo} key={i} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      )}

      {/* ══════════════ EVENTS ══════════════ */}
      {LANDING_SECTIONS.events && (
      <section id="events" className="ev-blue">
        {/* Drifting sparks instead of the old traveling dashed route — see
            EVENT_SPARKS above and .ev-sparks/.ev-spark in landing.css. */}
        <div className="ev-sparks" aria-hidden="true">
          {EVENT_SPARKS.map((s, i) => (
            <span
              key={i}
              className={`ev-spark ev-spark-${s.hue}`}
              style={
                {
                  left: s.left,
                  width: s.size,
                  height: s.size,
                  animationDuration: s.duration,
                  animationDelay: s.delay,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className="container">
          <Reveal className="v2-section-head">
            <div className="section-eyebrow">
              <span className="badge-dot" />
              On the ground
            </div>
            <h2 className="section-title">
              Events &amp; <em className="ht-serif">Participations</em>
            </h2>
            <p className="section-sub">
              Meetups, summits, and study sessions across the Philippines — plus competitions and
              showcases on the global stage.
            </p>
          </Reveal>

          <Reveal>
            <EventsShowcase events={EVENTS} />
          </Reveal>
        </div>
      </section>
      )}

      {/* Partnership CTA + the /partners overlay it opens — moved into its
          own component so the trigger and the overlay share one `useState`,
          the same way AboutSection owns both "Learn more about us" and the
          About overlay. See partners-section.tsx for why that's what makes
          open/close/reopen behave exactly like the About overlay. */}
      <PartnersSection />
    </div>
  );
}

// touch 1788822598
