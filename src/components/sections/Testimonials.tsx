"use client";

import { useState, type CSSProperties } from "react";
import { Reveal } from "@/components/landing/reveal";
import { CountUp } from "@/components/testimonials/CountUp";
import { MiniQuote } from "@/components/testimonials/MiniQuote";
import { WallCard } from "@/components/testimonials/WallCard";
import { byTier, communityStats, communityWinsPeso } from "@/data/testimonials";
import "./testimonials.css";

/** Fixed-angle particle set radiated by each firework "shell" in the
 * Community Wins celebration burst (see .ml-win-burst in testimonials.css).
 * Hand-picked angles/distances/delays rather than Math.random() so there's
 * no server/client mismatch risk, same reasoning as the sparks/beams
 * elsewhere on this page. Distances/sizes are the "resting" values — each
 * shell (below) scales them up or down for variety. */
const FIREWORK_PARTICLES: { angle: number; dist: number; size: number; delay: number; hue: "accent" | "teal" }[] = [
  { angle: 0, dist: 120, size: 9, delay: 0, hue: "accent" },
  { angle: 24, dist: 145, size: 6, delay: 0.03, hue: "teal" },
  { angle: 48, dist: 105, size: 8, delay: 0.05, hue: "accent" },
  { angle: 72, dist: 135, size: 6, delay: 0.01, hue: "teal" },
  { angle: 96, dist: 110, size: 8, delay: 0.04, hue: "accent" },
  { angle: 120, dist: 140, size: 6, delay: 0.02, hue: "teal" },
  { angle: 144, dist: 100, size: 9, delay: 0.06, hue: "accent" },
  { angle: 168, dist: 130, size: 6, delay: 0, hue: "teal" },
  { angle: 192, dist: 115, size: 8, delay: 0.05, hue: "accent" },
  { angle: 216, dist: 140, size: 6, delay: 0.03, hue: "teal" },
  { angle: 240, dist: 105, size: 9, delay: 0.01, hue: "accent" },
  { angle: 264, dist: 135, size: 6, delay: 0.04, hue: "teal" },
  { angle: 288, dist: 110, size: 8, delay: 0.02, hue: "accent" },
  { angle: 312, dist: 145, size: 6, delay: 0.06, hue: "teal" },
  { angle: 336, dist: 100, size: 9, delay: 0.03, hue: "accent" },
];

/** Three firework "shells" pop at slightly different spots and moments above
 * the peso-value card, each firing the full FIREWORK_PARTICLES set scaled by
 * `scale` — the staggered delay + varied position/size is what reads as
 * "fireworks" rather than a single centered pop. Left/top stay in percent so
 * the layout holds up at any card width. */
const FIREWORK_SHELLS: { left: string; top: string; delay: number; scale: number }[] = [
  { left: "26%", top: "44%", delay: 0, scale: 1.05 },
  { left: "50%", top: "36%", delay: 0.18, scale: 1.3 },
  { left: "74%", top: "48%", delay: 0.34, scale: 0.95 },
];

/**
 * Community testimonials, matching design-reference/sections/community-love.html:
 * stat row, the wide peso-value card, an editorial lede quote, four numbered
 * rows, a scrolling ticker, and the in-person strip.
 *
 * Everything renders from src/data/testimonials.ts, which drops any record
 * without confirmed consent before it reaches here.
 */
export function Testimonials() {
  // Bumped on every completed peso-value count-up (including replays from
  // scrolling back into view) — used as the burst's `key` so React remounts
  // it each time, replaying its once-only CSS animation instead of playing
  // it only the first time.
  const [burstKey, setBurstKey] = useState(0);

  const hero = byTier("hero")[0];
  const rows = byTier("card");
  // Last "card"-tier entry gets the gradient accent treatment.
  const plainRows = rows.slice(0, -1);
  const accentMember = rows[rows.length - 1];
  const ticks = byTier("mini");
  const inperson = byTier("inperson")[0];

  // Explicit 2-3-2 wall layout (see .ml-wall-pos-N in testimonials.css):
  // column 1 = hero + 1 card, column 2 = 3 cards, column 3 = 1 card + accent.
  // `plain` is every non-hero, non-accent card (the 4 "card"-tier members
  // plus the in-person one) in the order they should fill in.
  const plain = inperson ? [...plainRows, inperson] : plainRows;
  const wallCol1 = plain.slice(0, 1);
  const wallCol2 = plain.slice(1, 4);
  const wallCol3 = plain.slice(4, 5);

  return (
    <>
      <section id="community-love" className="v2-light">
        <div className="container">
          <Reveal className="v2-section-head">
            <div className="section-eyebrow">
              <span className="badge-dot" />
              Community Testimonials
            </div>
            <h2 className="section-title">
              What Our <em className="ht-serif">Members Say</em>
            </h2>
            <p className="section-sub">
              30,000+ members and counting. Real words from members, shared with their consent — no
              paid signals, no gatekeeping.
            </p>
          </Reveal>

          {(hero || rows.length > 0 || inperson) && (
            <Reveal className="ml-wall">
              {hero && <WallCard member={hero} variant="dark" className="ml-wall-pos-1" />}
              {wallCol1.map((m, i) => (
                <WallCard member={m} key={m.id} variant="light" className={`ml-wall-pos-2-${i}`} />
              ))}
              {wallCol2.map((m, i) => (
                <WallCard member={m} key={m.id} variant="light" className={`ml-wall-pos-3-${i}`} />
              ))}
              {wallCol3.map((m, i) => (
                <WallCard member={m} key={m.id} variant="light" className={`ml-wall-pos-4-${i}`} />
              ))}
              {accentMember && <WallCard member={accentMember} variant="accent" className="ml-wall-pos-5" />}
            </Reveal>
          )}

          {ticks.length > 0 && (
            /* Unframed strip on the section's own light background — an
                eyebrow label (same green pulsating .badge-dot treatment as
                "Community Testimonials" above) stacked on top of a
                scrolling row of member mini-quotes. Mochi doesn't have
                partner brand logos to drop in, so the row keeps the member
                mini-quotes instead. See .ml-ticker in testimonials.css. */
            <Reveal className="ml-ticker">
              <div className="section-eyebrow ml-ticker-label">
                <span className="badge-dot" />
                More From The Community
              </div>

              <div className="ml-marquee">
                <div className="ml-row">
                  {/* Duplicated once — the keyframe translates -50%, so the second
                      copy scrolls in seamlessly as the first leaves. */}
                  <div className="ml-track">
                    {[...ticks, ...ticks].map((m, i) => (
                      <MiniQuote member={m} key={`${m.id}-${i}`} />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Community stat row + peso-value card, moved out of #community-love
          so they can carry the dark theme used on the "Education" panel of
          the offer slider (`v2-dark`) instead of the light theme the rest of
          Community Testimonials uses. Sits between the ticker above and the
          Funded Traders section that follows on the page. See
          #community-stats rules in testimonials.css. */}
      {(communityStats.length > 0 || communityWinsPeso) && (
        <section id="community-stats" className="v2-dark">
          <div className="container">
            <Reveal className="v2-section-head ml-stats-head">
              <div className="section-eyebrow">
                <span className="badge-dot" />
                Community Wins
              </div>
              <h2 className="section-title">
                <span className="ml-stats-line">Free To Learn. Free To Grow.</span>
                <br />
                <span className="ml-stats-highlight">No Paywalls.</span>
              </h2>
              <p className="section-sub">
                No paid signals, no gatekeeping — just real traders helping each other learn, earn,
                and grow, together.
              </p>
            </Reveal>

            {communityStats.length > 0 && (
              <Reveal className="ml-stats">
                {communityStats.map((s) => (
                  <div className="ml-stat" key={s.label}>
                    <div className="ml-stat-label">{s.label}</div>
                    <CountUp value={s.value} className="ml-stat-value" />
                    {"caption" in s && s.caption && <p className="ml-stat-caption">{s.caption}</p>}
                  </div>
                ))}
              </Reveal>
            )}

            <Reveal className="ml-stat-wide">
              <div className="ml-stat-label">Total community wins in peso value</div>
              <CountUp
                value={communityWinsPeso}
                className="ml-stat-big"
                onDone={() => setBurstKey((k) => k + 1)}
              />
              {/* Celebration burst — three firework "shells" pop in sequence
                  once the number above lands on its target (see CountUp's
                  onDone). `key` forces a remount on every trigger (including
                  replays from scrolling back into view) so the once-only CSS
                  animations in .ml-win-burst play again instead of staying
                  finished. burstKey === 0 means "hasn't fired yet" — nothing
                  renders until the first count-up actually completes. */}
              {burstKey > 0 && (
                <div className="ml-win-burst" key={burstKey} aria-hidden="true">
                  {FIREWORK_SHELLS.map((shell, si) => (
                    <div
                      className="ml-win-shell"
                      key={si}
                      style={{ left: shell.left, top: shell.top } as CSSProperties}
                    >
                      <span
                        className="ml-win-flash"
                        style={{ animationDelay: `${shell.delay}s` } as CSSProperties}
                      />
                      {FIREWORK_PARTICLES.map((p, i) => (
                        <span
                          key={i}
                          className={`ml-win-particle ml-win-particle-${p.hue}`}
                          style={
                            {
                              "--angle": `${p.angle}deg`,
                              "--dist": `${Math.round(p.dist * shell.scale)}px`,
                              width: Math.round(p.size * shell.scale),
                              height: Math.round(p.size * shell.scale),
                              animationDelay: `${(shell.delay + p.delay).toFixed(2)}s`,
                            } as CSSProperties
                          }
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
