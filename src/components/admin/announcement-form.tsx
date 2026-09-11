"use client";

import { useActionState } from "react";
import { saveAnnouncement } from "@/lib/actions/admin";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import type { Announcement } from "@/lib/types";

type ActionState = { error?: string; ok?: boolean } | undefined;

export function AnnouncementForm({ announcement }: { announcement?: Announcement }) {
  const boundAction = saveAnnouncement.bind(null, announcement?.id ?? null);
  const [state, action, pending] = useActionState<ActionState, FormData>(boundAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Title *</span>
        <input name="title" required defaultValue={announcement?.title} className="input" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Body (markdown) *</span>
        <MarkdownEditor name="body_md" defaultValue={announcement?.body_md ?? ""} rows={8} />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_published" defaultChecked={announcement?.is_published} />
        Published
      </label>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save announcement"}
      </button>
    </form>
  );
}
