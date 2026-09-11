"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type CSSProperties } from "react";
import { PhotoSlot } from "@/components/core-team/photo-slot";
import { Reveal } from "@/components/landing/reveal";
import { coreTeam, handleName, initials } from "@/data/coreTeam";
import type { TeamMember } from "@/lib/types";
import "@/app/core-team/core-team.css";

const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/ZGJm8vKUbz";

const STORY_PARAGRAPHS = [
  "Mochi Web3 started in November 2025 with one belief: Web3 education should be free, accessible, and honest. We began with a small group of traders sharing real knowledge — no hype, no paid gatekeeping.",
  "Word spread fast. By early 2026, our no-nonsense approach to crypto education had attracted thousands of learners — from total beginners to experienced traders looking for a disciplined community.",
  "Mid-2026 brought curated airdrop guides, live trading sessions, and the BigBoss Calculator — free tools built to give every member a real edge, not a paid signal.",
  "Today, we're building NFT collections, community merch, real-time market tools, and mentorship programs — the most complete free Web3 ecosystem for our members. Started in 2025. Still building.",
];

/**
 * Watches for "?about=1" and opens the overlay via `onOpen`, then strips the
 * param from the URL. Split out from AboutSection because useSearchParams
 * needs a Suspense boundary, and isolating it here means the rest of the
 * overlay still renders immediately with no fallback flash.
 *
 * Uses next/navigation's reactive hooks (not window.location) specifically
 * so this fires on every client-side navigation to "/?about=1" — including
 * when the user is already on "/" and the nav/footer "Our Story" link only
 * changes the query string. A component doesn't remount just because its
 * query string changed, so a mount-only effect (or one reading
 * window.location) would silently miss that case.
 */
function AboutOverlayOpener({ onOpen }: { onOpen: () => void }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("about") !== "1") return;

    onOpen();

    const params = new URLSearchParams(searchParams.toString());
    params.delete("about");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [searchParams, pathname, router, onOpen]);

  return null;
}

/**
 * Photos for the About Us image column, in rotation order. All three are
 * processed identically (attention-crop to this column's real landscape
 * aspect at desktop widths, ~1.45:1, plus the same saturation/contrast lift
 * and top/bottom vignette) so the crossfade never has a jarring tone shift.
 */
const ABOUT_PHOTOS = [
  {
    src: "/images/landing/about-davao-2.webp",
    alt: "The Mochi Web3 community hanging out at a Davao meetup",
  },
  {
    src: "/images/landing/about-community.webp",
    alt: "The Mochi Web3 community at a meetup in Davao",
  },
  {
    src: "/images/landing/about-manila.webp",
    alt: "The Mochi Web3 community at a Manila meetup",
  },
] as const;

const ABOUT_PHOTO_INTERVAL_MS = 5000;

/** Auto-rotating crossfade carousel for the About Us image column, with
 * click-to-jump dots. Pauses the auto-advance while a dot has focus/hover
 * isn't tracked — kept simple since this is a background/ambient visual,
 * not primary content. */
function AboutPhotoCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ABOUT_PHOTOS.length);
    }, ABOUT_PHOTO_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {ABOUT_PHOTOS.map((photo, i) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          className="about-photo"
          width={1784}
          height={1230}
          priority={i === 0}
          style={{
            opacity: i === index ? 1 : 0,
            // The "about-community" photo has a member sitting right at the
            // left edge of the frame — center-cropping (the default for the
            // other two) still clipped her at a 20% shift, so this pins the
            // crop fully to the image's left edge instead: 0% guarantees the
            // left edge of the source is always the left edge of the
            // visible crop, no matter how the column's aspect ratio changes
            // across viewport widths, or where this photo lands in the
            // rotation order. Trades a bit more cropping off the right
            // side, which has room to spare. Keyed by src (not array index)
            // so the fix stays attached to this specific photo.
            objectPosition: photo.src === "/images/landing/about-community.webp" ? "0% center" : undefined,
          }}
        />
      ))}
      <div className="about-photo-dots">
        {ABOUT_PHOTOS.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            className={`about-photo-dot${i === index ? " is-active" : ""}`}
            aria-label={`Show photo ${i + 1} of ${ABOUT_PHOTOS.length}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </>
  );
}

/** Trading Mentors and Community Moderators have no `role` string in the
 * data (they were grouped by heading instead, in the card grids this strip
 * replaced) — these are the callout's fallback labels for anyone past the
 * Leadership slice. */
const MENTOR_ROLE_FALLBACK = "Trading Mentor";
const MODERATOR_ROLE_FALLBACK = "Community Moderator";

/**
 * The hand-drawn "People behind Mochi Web3!" caption + arrow. Lives inline
 * with the intro lede (see AboutSection below) rather than stacked above
 * the avatar row — pulled out of MeetTheTeamStrip so it can sit next to the
 * paragraph instead, with the avatar row following directly underneath and
 * no leftover dead space between them.
 *
 * The arrow itself is the artwork from the client-supplied arrow.psd (a
 * solid hand-drawn swoosh + open arrowhead), exported as a trimmed
 * transparent PNG and used as a CSS mask so it can be recolored to the
 * Mochi brand purple (var(--accent3)) and animated with a draw-in + gentle
 * bounce, rather than baked-in black pixels.
 */
function TeamStripNote() {
  return (
    <div className="ct-meet-note" aria-hidden="true">
      {/* Caption first, arrow second: the arrow needs to run FROM the
          caption's bottom edge DOWN toward the avatar row below, not sit
          above the text pointing at nothing. */}
      <p className="ct-meet-caption">People behind Mochi Web3!</p>
      <span className="ct-meet-arrow-img" />
    </div>
  );
}

/**
 * Core Team roster — a row of overlapping avatars with a speech-bubble
 * callout that swaps to whichever member is hovered (or tapped, on touch).
 * The hand-drawn arrow + caption pointing at it lives separately, inline
 * with the intro lede above (see TeamStripNote + AboutSection below).
 *
 * Featured set is Leadership, Trading Mentors, then Community Moderators —
 * the only remaining founder card (rendered separately below, when present)
 * isn't included here. This strip is now the only place those three groups
 * are shown; the Leadership / Trading Mentors / Community Moderators card
 * grids that used to sit below it were removed.
 */
function MeetTheTeamStrip() {
  // null = nothing hovered/focused/tapped yet — the callout stays hidden
  // until someone actually lands on an avatar, rather than defaulting to
  // the first member.
  const [active, setActive] = useState<number | null>(null);
  // Where to draw the callout: the active avatar's own offsetLeft/offsetTop
  // within .ct-meet-left (see the CSS comment on .ct-meet-callout). Measured
  // directly off the DOM instead of computed from the index, because the
  // full 19-member roster wraps onto multiple rows at most viewport widths —
  // an index * fixed-step formula only works for a single row.
  const [calloutPos, setCalloutPos] = useState<{ left: number; top: number } | null>(null);
  // Handles whose photo failed to decode — falls back to the initials
  // treatment instead of leaving a blank circle. Seen locally when the dev
  // server's image optimizer serves a stale/failed response right as this
  // overlay mounts; a real broken image path would hit the same fallback.
  const [failedPhotos, setFailedPhotos] = useState<Set<string>>(new Set());
  const members = [
    ...coreTeam.leadership.map((m) => ({ ...m, fallbackRole: undefined as string | undefined })),
    ...coreTeam.mentors.map((m) => ({ ...m, fallbackRole: MENTOR_ROLE_FALLBACK as string | undefined })),
    ...coreTeam.moderators.map((m) => ({ ...m, fallbackRole: MODERATOR_ROLE_FALLBACK as string | undefined })),
  ];
  if (members.length === 0) return null;

  const current = active !== null ? members[active] : null;
  const currentRole = current ? current.role ?? current.fallbackRole : null;

  const activate = (i: number, el: HTMLButtonElement) => {
    setActive(i);
    setCalloutPos({ left: el.offsetLeft, top: el.offsetTop });
  };

  return (
    <div className="ct-meet-strip">
      <div className="ct-meet-left">
        {current && calloutPos && (
          <div
            className="ct-meet-callout"
            style={{ left: calloutPos.left, top: calloutPos.top - 14 } as CSSProperties}
            aria-live="polite"
          >
            <div className="ct-meet-callout-name">{handleName(current.handle)}</div>
            <div className="ct-meet-callout-role">{currentRole}</div>
            <span className="ct-meet-callout-tail" aria-hidden="true" />
          </div>
        )}

        <div className="ct-meet-avatars" onMouseLeave={() => setActive(null)}>
          {members.map((m, i) => {
            const displayName = handleName(m.handle);
            return (
              <button
                key={m.handle}
                type="button"
                className={`ct-meet-avatar${i === active ? " is-active" : ""}`}
                onMouseEnter={(e) => activate(i, e.currentTarget)}
                onFocus={(e) => activate(i, e.currentTarget)}
                onBlur={() => setActive((a) => (a === i ? null : a))}
                onClick={(e) => activate(i, e.currentTarget)}
                aria-label={m.role ?? m.fallbackRole ? `${displayName}, ${m.role ?? m.fallbackRole}` : displayName}
                aria-pressed={i === active}
              >
                {m.photo && !failedPhotos.has(m.handle) ? (
                  <Image
                    src={m.photo}
                    alt=""
                    width={128}
                    height={128}
                    onError={() =>
                      setFailedPhotos((prev) => {
                        const next = new Set(prev);
                        next.add(m.handle);
                        return next;
                      })
                    }
                  />
                ) : (
                  <span className="ct-meet-avatar-initials" aria-hidden="true">
                    {initials(displayName)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AboutSection({ team }: { team: TeamMember[] }) {
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
        <AboutOverlayOpener onOpen={() => setOpen(true)} />
      </Suspense>

      <section id="story" className="v2-light">
        <Reveal className="about-split">
          <div className="about-img-col">
            {/* Rotating carousel of community photos — see ABOUT_PHOTOS
                above. The image column renders landscape (~1.45:1) at real
                desktop widths, so each photo is cropped to that aspect
                rather than portrait, with a matching contrast/saturation
                lift and top/bottom vignette. */}
            <AboutPhotoCarousel />
          </div>
          <div className="about-text-col">
            <div className="about-eyebrow">
              <span className="badge-dot" />
              <span>About Us</span>
            </div>
            <h2>
              A growing community,
              <br />
              <em className="ht-serif">big impact.</em>
            </h2>
            <p>
              Mochi Web3 was founded on a single belief: Web3 education should be free, accessible,
              and honest. What started as a small group of traders became a community built on real
              knowledge — no hype, no gatekeeping.
            </p>
            <p>
              From beginner guides to advanced trading strategies, from curated airdrop hunts to
              live mentorship sessions — everything we do is for the community, by the community.
            </p>
            <button className="btn-dark about-learn-btn" onClick={() => setOpen(true)}>
              <span>Learn more about us</span>
              <span className="btn-icon">↗</span>
            </button>
          </div>
        </Reveal>
      </section>

      <div
        id="about-overlay"
        className={`about-overlay${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="About Mochi Web3"
        aria-hidden={!open}
      >
        <button className="about-overlay-close" onClick={() => setOpen(false)} aria-label="Close">
          ✕
        </button>

        <div className="ao-section ao-dark">
          <Reveal className="ao-container">
            <div className="ao-hero-badge">
              <span className="badge-dot" />
              About Mochi Web3
            </div>
            <h2 className="ao-hero-title">
              Built to be
              <br />
              <em className="ht-serif">accessible.</em>
            </h2>
            <p className="ao-hero-text">
              Mochi Web3 started in November 2025 with one belief: Web3 education should be
              free, honest, and real. A year on, that hasn&apos;t changed.
            </p>
          </Reveal>
        </div>

        <div className="ao-section ao-light">
          <div className="ao-container">
            <Reveal className="ao-why-grid">
              <div className="ao-why-left">
                <p className="ao-super ao-super-light">
                  <span className="badge-dot" />
                  Why We Exist
                </p>
                <p className="ao-quote">
                  &ldquo;The gap between paid trading signals and real, free education is exactly
                  where we live.&rdquo;
                </p>
              </div>
              <div className="ao-why-right">
                <p>
                  Most of Web3 education is either locked behind a paywall or buried in hype. On
                  one side, paid signal groups: often convincing, often expensive, with no
                  guarantee they still work tomorrow. On the other, raw information overload —
                  plenty of content, no one to trust.
                </p>
                <p>
                  We built Mochi Web3 in the space between — a place where the guides are free,
                  the community is real, and nobody is trying to sell you a signal. That&apos;s
                  not a marketing angle, it&apos;s the whole reason we started.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="ao-section ao-dark ao-story-section">
          <Reveal className="ao-container ao-story-container">
            <div className="ao-story-text">
              <p className="ao-story-ghost">Est. 2025</p>
              <p className="ao-super">
                <span className="badge-dot" />
                Our Story
              </p>
              <h2 className="ao-section-title ao-story-title">
                Started in 2025.
                <br />
                <em className="ht-serif">Still building.</em>
              </h2>
              <div className="ao-story-body">
                {STORY_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="ao-story-visual">
              <Image src="/images/mw-logo.png" alt="Mochi Web3" width={480} height={484} />
            </div>
          </Reveal>
        </div>

        <div className="ao-section ao-light">
          {/* The full /core-team page content, embedded here so "Core Team"
              no longer needs its own nav entry — this overlay is now the
              one place both the story and the people live. Reuses that
              page's own components/data verbatim, minus its "back to
              mochiworld" link (not meaningful inside a modal). core-team.css
              is already a light "paper" theme (same family as "Why We
              Exist" above), so no token overrides are needed here — just the
              shared `.ao-container` wrapper so this section lines up with
              every other section's width/padding instead of the standalone
              page's own `.ct-shell` measure. */}
          <div className="ct-page ct-embedded">
            <div className="ao-container">
              <Reveal>
                <p className="ao-super ao-super-light">
                  <span className="badge-dot" />
                  Our People
                </p>
                <h2 className="ao-section-title ao-title-dark">
                  Meet the <em className="ht-serif">Core Team</em>
                </h2>
                <div className="ct-meet-intro-row">
                  <p className="ct-lede ct-lede-intro">
                    Traders, builders, and educators united by one mission — making Web3 education
                    free and accessible to all.
                  </p>
                  <TeamStripNote />
                </div>
              </Reveal>

              <Reveal>
                <MeetTheTeamStrip />
              </Reveal>

              {coreTeam.founder[0] && (
                <Reveal className="ct-card-grid ct-card-grid-founder">
                  <article className="ct-team-card" tabIndex={0}>
                    <div className="ct-team-card-inner">
                      <div className="ct-team-card-front">
                        <div className="ct-team-card-media">
                          <PhotoSlot
                            name={handleName(coreTeam.founder[0].handle)}
                            photo={coreTeam.founder[0].photo}
                            variant="founder"
                          />
                        </div>
                        <div className="ct-team-card-name">{handleName(coreTeam.founder[0].handle)}</div>
                        <div className="ct-team-card-role">{coreTeam.founder[0].role}</div>
                      </div>
                      {coreTeam.founder[0].blurb && (
                        <div className="ct-team-card-back">
                          <p>{coreTeam.founder[0].blurb}</p>
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              )}

            </div>
          </div>
        </div>

        <div className="ao-section ao-dark ao-cta-section">
          <Reveal className="ao-container" style={{ textAlign: "center" }}>
            <p className="ao-cta-label">Ready to start your Web3 journey?</p>
            <a href={DISCORD_URL} className="btn-dark" target="_blank" rel="noopener noreferrer">
              <span>Join Our Community</span>
              <span className="btn-icon">↗</span>
            </a>
          </Reveal>
        </div>
      </div>
    </>
  );
}
