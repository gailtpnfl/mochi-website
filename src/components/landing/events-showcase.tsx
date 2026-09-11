"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";

export interface ShowcaseEvent {
  title: string;
  date: string;
  caption: string;
  /** Substring of `caption` to render in bold (must match exactly). */
  boldPart: string;
  status: "upcoming" | "completed";
  src: string | null;
  alt: string;
}

/**
 * Upcoming/Completed segmented control over the full events list. Switching
 * tabs slides the pill background and re-mounts the grid (keyed by tab) so
 * the cards replay their staggered fade-up entrance — cheaper than tracking
 * enter/exit state by hand, and the same "remount = replay" idea CountUp
 * uses for its own re-entry animation.
 */
export function EventsShowcase({ events }: { events: ShowcaseEvent[] }) {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");
  const upcoming = events.filter((e) => e.status === "upcoming");
  const completed = events.filter((e) => e.status === "completed");
  const shown = tab === "upcoming" ? upcoming : completed;

  return (
    <div className="ev-showcase">
      <div className="ev-tabs" role="tablist">
        <div className={`ev-tabs-pill ${tab === "completed" ? "is-completed" : ""}`} />
        <button
          type="button"
          role="tab"
          aria-selected={tab === "upcoming"}
          className={`ev-tab ${tab === "upcoming" ? "is-active" : ""}`}
          onClick={() => setTab("upcoming")}
        >
          Upcoming <span className="ev-tab-count">{upcoming.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "completed"}
          className={`ev-tab ${tab === "completed" ? "is-active" : ""}`}
          onClick={() => setTab("completed")}
        >
          Completed <span className="ev-tab-count">{completed.length}</span>
        </button>
      </div>

      {shown.length > 0 ? (
        <EventsRail events={shown} key={tab} />
      ) : (
        <div className="ev-empty" key={tab}>
          No {tab} events yet — check back soon.
        </div>
      )}
    </div>
  );
}

/** Single-row, horizontally-scrolling rail for one tab's events — cards keep
 * their original ~3-up size instead of shrinking to fit everyone in view,
 * and the arrow buttons page across instead of wrapping to a second row.
 * Keyed by the parent on `tab`, so switching tabs remounts this fresh: scroll
 * position resets to the start and the arrow-visibility effect re-attaches
 * against the new card set, same "remount = replay" idea the fade-up
 * entrance animation already relies on. */
function EventsRail({ events }: { events: ShowcaseEvent[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const updateArrows = () => {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".ev-card");
    const step = card ? card.getBoundingClientRect().width + 22 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <div
      className={`ev-rail${canScrollLeft ? " can-scroll-left" : ""}${canScrollRight ? " can-scroll-right" : ""}`}
    >
      <button
        type="button"
        className="ev-arrow ev-arrow-prev"
        aria-label="Show previous events"
        onClick={() => scrollByCard(-1)}
        disabled={!canScrollLeft}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="ev-grid" ref={railRef}>
        {events.map((e, i) => (
          <div className="ev-card" key={e.title} style={{ "--i": i } as CSSProperties}>
            <div className="ev-shot">
              {e.src ? (
                <Image src={e.src} alt={e.alt} width={420} height={240} />
              ) : (
                <div className="ev-shot-empty">{e.alt}</div>
              )}
              <span className={`ev-status ev-status-${e.status}`}>
                {e.status === "upcoming" ? "Upcoming" : "Completed"}
              </span>
            </div>
            <div className="ev-date">{e.date}</div>
            <div className="ev-title">{e.title}</div>
            <p className="ev-caption">
              {(() => {
                const idx = e.caption.indexOf(e.boldPart);
                if (idx === -1) return e.caption;
                return (
                  <>
                    {e.caption.slice(0, idx)}
                    <strong>{e.boldPart}</strong>
                    {e.caption.slice(idx + e.boldPart.length)}
                  </>
                );
              })()}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="ev-arrow ev-arrow-next"
        aria-label="Show more events"
        onClick={() => scrollByCard(1)}
        disabled={!canScrollRight}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
