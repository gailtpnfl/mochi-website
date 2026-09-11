"use client";

import { useActionState } from "react";
import { saveAirdrop } from "@/lib/actions/admin";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import type { Airdrop, Partner } from "@/lib/types";

type ActionState = { error?: string; ok?: boolean } | undefined;

export function AirdropForm({
  airdrop,
  partners,
}: {
  airdrop?: Airdrop;
  partners: Partner[];
}) {
  const boundAction = saveAirdrop.bind(null, airdrop?.id ?? null);
  const [state, action, pending] = useActionState<ActionState, FormData>(boundAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title *">
          <input name="title" required defaultValue={airdrop?.title} className="input" />
        </Field>
        <Field label="Slug *">
          <input
            name="slug"
            required
            defaultValue={airdrop?.slug}
            pattern="[a-z0-9-]+"
            className="input"
          />
        </Field>
        <Field label="Chain">
          <input name="chain" defaultValue={airdrop?.chain ?? ""} className="input" />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={airdrop?.status ?? "upcoming"} className="input">
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="ended">Ended</option>
          </select>
        </Field>
        <Field label="External URL">
          <input name="external_url" defaultValue={airdrop?.external_url ?? ""} className="input" />
        </Field>
        <Field label="Cover image URL">
          <input
            name="cover_image_url"
            defaultValue={airdrop?.cover_image_url ?? ""}
            className="input"
          />
        </Field>
        <Field label="Partner">
          <select name="partner_id" defaultValue={airdrop?.partner_id ?? ""} className="input">
            <option value="">None</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Summary">
        <textarea name="summary" rows={2} defaultValue={airdrop?.summary ?? ""} className="input" />
      </Field>

      <Field label="Guide (markdown)">
        <MarkdownEditor name="guide_md" defaultValue={airdrop?.guide_md ?? ""} rows={12} />
      </Field>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_featured" defaultChecked={airdrop?.is_featured} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_archived" defaultChecked={airdrop?.is_archived} />
          Archived
        </label>
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save airdrop"}
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
