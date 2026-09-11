"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

/**
 * Wraps /mentorship's content in the same `.about-overlay` full-screen panel
 * + round ✕ close button as /partners (see partners-overlay-shell.tsx for
 * the full reasoning) — same visual system as that page, so the two form
 * pages behave identically: no site Nav/Footer around them (see chrome.tsx's
 * FULLSCREEN_ROUTES), a fixed full-viewport dark panel with its own scroll,
 * and a close button that always lands on plain "/" rather than
 * `router.back()` — visitors can reach /mentorship from more than one place
 * (the footer's "Mentorship" link, the homepage nav, a direct link), and
 * whichever entry is one history step back isn't necessarily the homepage
 * top.
 */
export function MentorshipOverlayShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const closingRef = useRef(false);

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleClose() {
    if (closingRef.current) return;
    closingRef.current = true;
    setOpen(false);
    document.body.style.overflow = "";
    router.push("/");
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // handleClose is intentionally not in the deps array — see the same note
    // in partners-overlay-shell.tsx.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`about-overlay${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mentorship"
    >
      <button type="button" onClick={handleClose} className="about-overlay-close" aria-label="Close">
        ✕
      </button>
      {children}
    </div>
  );
}
