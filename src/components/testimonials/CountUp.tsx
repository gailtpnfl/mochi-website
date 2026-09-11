"use client";

import { useEffect, useRef } from "react";

/**
 * Animates a stat value from 0 up to its parsed target every time the
 * element scrolls into view — mutates the DOM directly (via a ref) rather
 * than driving the count through React state, which would re-render on
 * every frame. Unlike <Reveal>, the observer here is never unobserved after
 * the first fire, so scrolling the number out of view and back in replays
 * the count-up instead of leaving it static after the first page load.
 *
 * Handles the two stat shapes used on this page: compact ("10K+", "75+",
 * "5M+") and comma-grouped ("35,000,000").
 */
function parseTarget(raw: string) {
  if (raw.includes(",")) {
    const target = parseInt(raw.replace(/,/g, ""), 10);
    return { target, format: (n: number) => Math.round(n).toLocaleString("en-US") };
  }

  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return { target: 0, format: () => raw };

  const [, numeric, suffix] = match;
  const target = parseFloat(numeric);
  const decimals = numeric.includes(".") ? numeric.split(".")[1].length : 0;

  return {
    target,
    format: (n: number) => `${decimals ? n.toFixed(decimals) : Math.round(n)}${suffix}`,
  };
}

const DURATION_MS = 1200;

// Starts fast, settles gently instead of ticking to a stop.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({
  value,
  className,
  onDone,
}: {
  value: string;
  className?: string;
  /** Fires once the count-up reaches its target — including the
   * reduced-motion path, which lands on the target instantly. Called again
   * every time the count-up replays (scrolling back into view), same as
   * the count-up itself. Used to time effects that should land just after
   * the number does, e.g. the "Community Wins" celebration burst. */
  onDone?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { target, format } = parseTarget(value);
    let rafId: number | null = null;

    const animate = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = format(target);
        onDone?.();
        return;
      }

      el.textContent = format(0);
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION_MS);
        el.textContent = format(target * easeOutCubic(progress));
        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = null;
          onDone?.();
        }
      };
      rafId = requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      animate();
      return;
    }

    // No unobserve here (unlike <Reveal>) — re-entering the viewport should
    // replay the count-up, not leave it static after the first time.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) animate();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onDone is passed
    // fresh each render by callers (an inline closure); re-running this
    // effect on every render would re-create the observer for no reason.
    // It's read at call time inside animate(), so a stale closure isn't a
    // correctness issue here.
  }, [value]);

  return (
    <div ref={ref} className={className}>
      {value}
    </div>
  );
}
