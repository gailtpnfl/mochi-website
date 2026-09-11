"use client";

import { useTransition, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { markLessonComplete } from "@/app/learn/actions";

export function MarkCompleteButton({
  lessonId,
  courseSlug,
  initiallyDone,
  signedIn,
}: {
  lessonId: string;
  courseSlug: string;
  initiallyDone: boolean;
  signedIn: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(initiallyDone);

  // No sign-in exists any more, so there is no progress to mark.
  if (!signedIn) return null;

  if (done) {
    return (
      <span className="flex items-center gap-2 text-sm text-emerald-400">
        <CheckCircle2 size={18} /> Completed
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await markLessonComplete(lessonId, courseSlug);
          if (result?.ok) setDone(true);
        });
      }}
      className="rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Saving..." : "Mark complete"}
    </button>
  );
}
