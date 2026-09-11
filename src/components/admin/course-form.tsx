"use client";

import { useActionState } from "react";
import { saveCourse } from "@/lib/actions/admin";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import type { Course } from "@/lib/types";

type ActionState = { error?: string; ok?: boolean } | undefined;

export function CourseForm({ course }: { course?: Course }) {
  const boundAction = saveCourse.bind(null, course?.id ?? null);
  const [state, action, pending] = useActionState<ActionState, FormData>(boundAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title *">
          <input name="title" required defaultValue={course?.title} className="input" />
        </Field>
        <Field label="Slug *">
          <input name="slug" required defaultValue={course?.slug} pattern="[a-z0-9-]+" className="input" />
        </Field>
        <Field label="Cover image URL">
          <input name="cover_image_url" defaultValue={course?.cover_image_url ?? ""} className="input" />
        </Field>
        <Field label="Position (order)">
          <input type="number" name="position" defaultValue={course?.position ?? 0} className="input" />
        </Field>
      </div>

      <Field label="Description (markdown)">
        <MarkdownEditor name="description_md" defaultValue={course?.description_md ?? ""} rows={4} />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_published" defaultChecked={course?.is_published} />
        Published
      </label>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save course"}
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
