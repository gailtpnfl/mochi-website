"use client";

import { useActionState, useTransition } from "react";
import { assignReviewer, submitReviewFeedback } from "@/lib/actions/admin";
import { Markdown } from "@/components/markdown";

type ActionState = { error?: string; ok?: boolean } | undefined;

interface TradeReviewCardProps {
  id: string;
  title: string;
  submitterName: string;
  submissionMd: string | null;
  feedbackMd: string | null;
  status: "submitted" | "reviewed";
  reviewedByMe: boolean;
  currentAdminId: string;
}

export function TradeReviewCard({
  id,
  title,
  submitterName,
  submissionMd,
  feedbackMd,
  status,
  reviewedByMe,
  currentAdminId,
}: TradeReviewCardProps) {
  const [pending, startTransition] = useTransition();
  const boundFeedback = submitReviewFeedback.bind(null, id);
  const [state, action, feedbackPending] = useActionState<ActionState, FormData>(boundFeedback, undefined);

  return (
    <div className="mw-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted">from {submitterName}</p>
        </div>
        <span className="rounded-full border border-border px-2.5 py-0.5 text-xs capitalize text-muted">
          {status}
        </span>
      </div>

      {submissionMd && (
        <div className="mt-3">
          <Markdown>{submissionMd}</Markdown>
        </div>
      )}

      {!reviewedByMe ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => assignReviewer(id, currentAdminId))}
          className="mt-4 rounded-full border border-border px-4 py-2 text-xs hover:bg-white/5 disabled:opacity-50"
        >
          Take this review
        </button>
      ) : (
        <form action={action} className="mt-4 flex flex-col gap-2">
          <textarea
            name="feedback_md"
            rows={3}
            defaultValue={feedbackMd ?? ""}
            placeholder="Feedback for this trade..."
            className="input"
          />
          {state?.error && <p className="text-xs text-red-400">{state.error}</p>}
          <button
            type="submit"
            disabled={feedbackPending}
            className="self-start rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-5 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {feedbackPending ? "Saving..." : "Save feedback"}
          </button>
        </form>
      )}
    </div>
  );
}
