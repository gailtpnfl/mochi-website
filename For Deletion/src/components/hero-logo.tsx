"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function HeroLogo() {
  const ref = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-scrolled={scrolled}
      className="mw-hero-zoom mw-logo-stage relative flex items-center justify-center py-8"
    >
      <div className="mw-logo-spin relative h-56 w-56 sm:h-72 sm:w-72">
        <Image src="/official_logo.png" alt="Mochi Web3" fill priority className="object-contain drop-shadow-2xl" />
      </div>
      <div className="mw-logo-shadow absolute bottom-2 h-6 w-40 rounded-full bg-black blur-xl sm:w-56" />
    </div>
  );
}
