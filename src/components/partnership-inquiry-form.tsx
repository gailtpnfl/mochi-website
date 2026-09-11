"use client";

import { useState, type FormEvent } from "react";

// Same link used by the Partnership CTA and the overlay's "let's talk" line —
// repeated here rather than threaded as a prop so this component stays
// self-contained for both of its call sites (the overlay and the standalone
// /partners page).
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/gab-fornier";

export function PartnershipInquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      org_name: formData.get("org_name"),
      contact_name: formData.get("contact_name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/partnership-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="mw-card p-6 text-sm text-muted">
        Thanks &mdash; we&apos;ve received your inquiry and will follow up by email.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mw-card pf-card flex flex-col gap-4 p-6">
      {/* Header row — small eyebrow label + a right-aligned helper note,
          separated from the fields by a rule. Mirrors the reference's
          "START A PROJECT" / "Fastest way to a scoped reply. * required."
          strip at the top of its bordered form panel. */}
      <div className="pf-head">
        <span className="pf-head-label">WE&apos;D LIKE TO HEAR FROM YOU</span>
        <span className="pf-head-note">Fastest way to a reply. * required.</span>
      </div>

      {/* Organization + Your Name side by side, same two-column-row shape as
          the reference's First Name / Last Name — these two still map to
          org_name/contact_name in the API, admin dashboard, and
          validations, just laid out to match. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="org_name" className="mb-1 block text-sm font-medium">
            Organization *
          </label>
          <input
            id="org_name"
            name="org_name"
            required
            className="w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-end)]"
          />
        </div>
        <div>
          <label htmlFor="contact_name" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <input
            id="contact_name"
            name="contact_name"
            className="w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-end)]"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-end)]"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-end)]"
        />
      </div>
      {status === "error" && <p className="text-xs text-red-400">{errorMessage}</p>}

      {/* Two buttons, same as the reference's "Send inquiry" + "Book a
          15-min intro" pair — the form isn't the only way in, so the
          Calendly link stays available right next to Send. Same sticker
          pair as the homepage's Partner With Us (.btn-dark) / Book a Call
          (.btn-light) buttons — this form renders inside .mw-landing on
          both the overlay and the standalone /partners page, so those
          classes reach it here too. */}
      <div className="pf-actions">
        <button type="submit" disabled={status === "loading"} className="btn-dark pf-submit">
          <span>{status === "loading" ? "Sending..." : "Send Inquiry"}</span>
          <span className="btn-icon" aria-hidden>
            ↗
          </span>
        </button>
        <a href={CALENDLY_URL} className="btn-light" target="_blank" rel="noopener noreferrer">
          <span>Book a Call</span>
        </a>
      </div>
    </form>
  );
}
