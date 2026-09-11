"use client";

import { useTransition } from "react";
import { reviewApplication } from "@/lib/actions/admin";
import type { ApplicationStatus } from "@/lib/types";

export function ApplicationReviewButtons({ id, status }: { id: string; status: ApplicationStatus }) {
  const [pending, startTransition] = useTransition();

  if (status !== "pending") {
    return <span className="text-xs capitalize text-muted">{status}</span>;
  }

  return (
    <div className="flex gap-2">
      {(["accepted", "waitlisted", "rejected"] as const).map((next) => (
        <button
          key={next}
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => reviewApplication(id, next))}
          className="rounded-full border border-border px-3 py-1 text-xs capitalize hover:bg-white/5 disabled:opacity-50"
        >
          {next}
        </button>
      ))}
    </div>
  );
}
