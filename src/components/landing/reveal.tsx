"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Adds `.visible` once the element scrolls into view, driving the fadeUp
 * reveal in landing.css (`.reveal` / `.reveal.visible`).
 *
 * The class is toggled on the DOM node rather than through state: the element
 * ships from the server as `.reveal` (hidden) and is revealed once, so there is
 * nothing for React to re-render.
 */
export function Reveal({
  className = "",
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
