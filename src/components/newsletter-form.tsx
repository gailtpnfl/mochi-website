"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong.");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return <p className="text-sm text-muted">You&apos;re subscribed. Welcome to Mochi.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-full border border-border bg-white/5 px-4 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-[var(--accent-end)]"
      />
      <button type="submit" disabled={status === "loading"} className="ft-subscribe">
        <span>{status === "loading" ? "Joining..." : "Subscribe"}</span>
        <span className="btn-icon" aria-hidden>
          ↗
        </span>
      </button>
      {status === "error" && <p className="text-xs text-red-400 sm:ml-2">{errorMessage}</p>}
    </form>
  );
}
