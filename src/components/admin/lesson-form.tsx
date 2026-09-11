"use client";

import { useActionState } from "react";
import { saveLesson } from "@/lib/actions/admin";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import type { Lesson } from "@/lib/types";

type ActionState = { error?: string; ok?: boolean } | undefined;

export function LessonForm({ courseId, lesson }: { courseId: string; lesson?: Lesson }) {
  const boundAction = saveLesson.bind(null, courseId, lesson?.id ?? null);
  const [state, action, pending] = useActionState<ActionState, FormData>(boundAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title *">
          <input name="title" required defaultValue={lesson?.title} className="input" />
        </Field>
        <Field label="Slug *">
          <input name="slug" required defaultValue={lesson?.slug} pattern="[a-z0-9-]+" className="input" />
        </Field>
        <Field label="Module title">
          <input name="module_title" defaultValue={lesson?.module_title ?? ""} className="input" />
        </Field>
        <Field label="Position (order)">
          <input type="number" name="position" defaultValue={lesson?.position ?? 0} className="input" />
        </Field>
        <Field label="Video URL (embeddable)">
          <input name="video_url" defaultValue={lesson?.video_url ?? ""} className="input" />
        </Field>
      </div>

      <Field label="Content (markdown)">
        <MarkdownEditor name="content_md" defaultValue={lesson?.content_md ?? ""} rows={10} />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_published" defaultChecked={lesson?.is_published ?? true} />
        Published
      </label>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save lesson"}
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
