"use client";

import Link from "next/link";
import { isRouteVisible } from "@/lib/site-visibility";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Counts a stat up from 0 to its target each time its panel becomes active
 * (scrolled into view via OfferSlider's progress tracking) — makes the
 * number feel earned instead of just printed, and replays as a nice pulse
 * of life whenever you scroll back to it. Used on all three panels
 * (Education, Mentorship, Tools).
 *
 * No "only run once" ref guard here on purpose: Next dev wraps the app in
 * React.StrictMode, which double-invokes effects (mount → cleanup →
 * mount) — a ref that flips permanently true on first run would get
 * cancelled by the StrictMode cleanup and then blocked from ever
 * restarting, leaving the counter stuck at 0. Explicitly resetting display
 * to 0 at the top of the effect makes the double-invoke a harmless replay
 * instead.
 */
function CountUpStat({ value, active }: { value: string; active: boolean }) {
  const target = Number.parseInt(value, 10);
  const [display, setDisplay] = useState(Number.isNaN(target) ? value : 0);

  useEffect(() => {
    if (!active || Number.isNaN(target)) return;
    setDisplay(0);

    const duration = 900;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3; // ease-out cubic
      setDisplay(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return <span className="offer-big-num">{display}</span>;
}

// Same fallback pattern as footer.tsx / page.tsx's other Discord links.
const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/ZGJm8vKUbz";

interface Panel {
  num: string;
  eyebrow: string;
  title: string;
  emphasis: string;
  desc: string;
  stat: string;
  statPlus?: string;
  statLabel: string;
  watermark: string;
  light?: boolean;
  cta?: { label: string; href: string; external?: boolean };
}

const PANELS: Panel[] = [
  {
    num: "01",
    eyebrow: "Education",
    title: "Web3 Knowledge,",
    emphasis: "For Everyone.",
    desc: "We run daily teaching sessions and open Q&A hosted by our mentors — completely free. Get real answers, live breakdowns, and hands-on guidance every single day.",
    stat: "100",
    statPlus: "+",
    statLabel: "Free Lessons",
    watermark: "Education",
    // Points at Discord instead of /learn per request, same as the other
    // "Join Our Discord" CTAs on the site.
    cta: { label: "Start learning", href: DISCORD_URL, external: true },
  },
  {
    num: "02",
    eyebrow: "Mentorship",
    title: "Guided by Experts,",
    emphasis: "Built for You.",
    desc: "Get direct access to experienced traders and Web3 builders. Our mentorship program pairs you with the right mentor so you can grow faster with real feedback.",
    stat: "500",
    statPlus: "+",
    statLabel: "Students Mentored",
    watermark: "Mentorship",
    light: true,
    cta: { label: "Apply for mentorship", href: "/mentorship" },
  },
  {
    num: "03",
    eyebrow: "Tools",
    title: "Powerful Tools,",
    emphasis: "Always Free.",
    desc: "From the BigBoss Calculator to live market updates and airdrop trackers — every tool we build is designed to give you an edge, completely free of charge.",
    stat: "5",
    statPlus: "+",
    statLabel: "Free Tools",
    watermark: "Tools",
    // Points at Discord instead of /tools per request, same as the other
    // "Join Our Discord" CTAs on the site.
    cta: { label: "Explore the tools", href: DISCORD_URL, external: true },
  },
];

/**
 * Scroll-driven panel slider. The section is 600vh tall with a sticky 100vh
 * wrap; scroll progress through the section selects the active panel.
 */
export function OfferSlider() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const scrolled = Math.max(0, -section.getBoundingClientRect().top);
      const total = section.offsetHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, scrolled / total) : 0;
      setActive(Math.min(PANELS.length - 1, Math.floor(progress * PANELS.length)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = useCallback((idx: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const total = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: section.offsetTop + (idx / PANELS.length) * total,
      behavior: "smooth",
    });
  }, []);

  return (
    <section id="what-we-offer" className="v2-dark" ref={sectionRef}>
      <div className={`offer-wrap${PANELS[active].light ? " offer-wrap-light" : ""}`}>
        {PANELS.map((panel, i) => (
          <div
            key={panel.num}
            className={`offer-panel${panel.light ? " offer-light" : ""}${
              i === active ? " is-active" : ""
            }`}
            data-panel={i}
          >
            <div className="offer-left">
              <h2 className="offer-title">
                {panel.title}
                <br />
                <em className="ht-serif">{panel.emphasis}</em>
              </h2>
              <p className="offer-desc">{panel.desc}</p>
              {/* The panel copy stands on its own during soft launch; only the
                  CTA is dropped when its destination is gated. External CTAs
                  (the Discord links) skip that gate entirely — same as
                  linkVisible's "external links always survive" rule in
                  footer.tsx — and render as a plain <a> instead of a Next
                  Link, opened in a new tab. */}
              {panel.cta && (panel.cta.external || isRouteVisible(panel.cta.href)) && (
                panel.cta.external ? (
                  <a
                    href={panel.cta.href}
                    className="btn-dark offer-apply-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{panel.cta.label}</span>
                    <span className="btn-icon">↗</span>
                  </a>
                ) : (
                  <Link href={panel.cta.href} className="btn-dark offer-apply-btn">
                    <span>{panel.cta.label}</span>
                    <span className="btn-icon">↗</span>
                  </Link>
                )
              )}
            </div>
            <div className="offer-right">
              <div className="offer-big-stat">
                <CountUpStat value={panel.stat} active={i === active} />
                {panel.statPlus && <span className="offer-big-plus">{panel.statPlus}</span>}
              </div>
              <div className="offer-big-label">
                <span className="offer-dash-line" /> {panel.statLabel}
              </div>
            </div>
            <div className="offer-watermark">{panel.watermark}</div>
          </div>
        ))}

        <div className="offer-nav-bar">
          {PANELS.map((panel, i) => (
            <button
              key={panel.num}
              className={`offer-nav-dash${i === active ? " is-active" : ""}`}
              data-target={i}
              aria-label={panel.eyebrow}
              aria-current={i === active}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
