"use client";

import { useActionState } from "react";
import { saveCohort } from "@/lib/actions/admin";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import type { Cohort } from "@/lib/types";

type ActionState = { error?: string; ok?: boolean } | undefined;

export function CohortForm({ cohort }: { cohort?: Cohort }) {
  const boundAction = saveCohort.bind(null, cohort?.id ?? null);
  const [state, action, pending] = useActionState<ActionState, FormData>(boundAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Name *">
          <input name="name" required defaultValue={cohort?.name} className="input" />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={cohort?.status ?? "upcoming"} className="input">
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </Field>
        <div />
        <Field label="Starts">
          <input type="date" name="starts_at" defaultValue={cohort?.starts_at ?? ""} className="input" />
        </Field>
        <Field label="Ends">
          <input type="date" name="ends_at" defaultValue={cohort?.ends_at ?? ""} className="input" />
        </Field>
      </div>

      <Field label="Description (markdown)">
        <MarkdownEditor name="description_md" defaultValue={cohort?.description_md ?? ""} rows={6} />
      </Field>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save cohort"}
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
