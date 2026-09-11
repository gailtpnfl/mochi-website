"use client";

import { useActionState } from "react";
import { saveJobPosting } from "@/lib/actions/admin";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import type { JobPosting } from "@/lib/types";

type ActionState = { error?: string; ok?: boolean } | undefined;

export function JobPostingForm({ job }: { job?: JobPosting }) {
  const boundAction = saveJobPosting.bind(null, job?.id ?? null);
  const [state, action, pending] = useActionState<ActionState, FormData>(boundAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title *">
          <input name="title" required defaultValue={job?.title} className="input" />
        </Field>
        <Field label="Slug *">
          <input name="slug" required defaultValue={job?.slug} pattern="[a-z0-9-]+" className="input" />
        </Field>
        <Field label="Organization">
          <input name="org" defaultValue={job?.org ?? "Mochi Agency"} className="input" />
        </Field>
        <Field label="Type">
          <select name="type" defaultValue={job?.type ?? "part_time"} className="input">
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </Field>
        <Field label="Location">
          <input name="location" defaultValue={job?.location ?? "Remote"} className="input" />
        </Field>
        <Field label="Apply URL / mailto">
          <input name="apply_url" defaultValue={job?.apply_url ?? ""} className="input" />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={job?.status ?? "open"} className="input">
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </Field>
      </div>

      <Field label="Description (markdown)">
        <MarkdownEditor name="description_md" defaultValue={job?.description_md ?? ""} rows={8} />
      </Field>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save job posting"}
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
