"use client";

import { useActionState } from "react";
import { saveSession } from "@/lib/actions/admin";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import type { MentorshipSession } from "@/lib/types";

type ActionState = { error?: string; ok?: boolean } | undefined;

export function SessionForm({ cohortId, session }: { cohortId: string; session?: MentorshipSession }) {
  const boundAction = saveSession.bind(null, cohortId, session?.id ?? null);
  const [state, action, pending] = useActionState<ActionState, FormData>(boundAction, undefined);

  const defaultDateTime = session
    ? new Date(session.scheduled_at).toISOString().slice(0, 16)
    : undefined;

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title *">
          <input name="title" required defaultValue={session?.title} className="input" />
        </Field>
        <Field label="Date & time (your local time) *">
          <input type="datetime-local" name="scheduled_at" required defaultValue={defaultDateTime} className="input" />
        </Field>
        <Field label="Duration (minutes)">
          <input type="number" name="duration_minutes" defaultValue={session?.duration_minutes ?? 60} className="input" />
        </Field>
        <Field label="Location / join URL">
          <input name="location_url" defaultValue={session?.location_url ?? ""} className="input" />
        </Field>
      </div>

      <Field label="Description (markdown)">
        <MarkdownEditor name="description_md" defaultValue={session?.description_md ?? ""} rows={4} />
      </Field>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save session"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}
