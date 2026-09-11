"use client";

import { useActionState } from "react";
import { saveWatchlistItem } from "@/lib/actions/admin";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import type { WatchlistItem } from "@/lib/types";

type ActionState = { error?: string; ok?: boolean } | undefined;

export function WatchlistForm({ item }: { item?: WatchlistItem }) {
  const boundAction = saveWatchlistItem.bind(null, item?.id ?? null);
  const [state, action, pending] = useActionState<ActionState, FormData>(boundAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Symbol *">
          <input name="symbol" required defaultValue={item?.symbol} className="input" />
        </Field>
        <Field label="Exchange">
          <input name="exchange" defaultValue={item?.exchange ?? ""} placeholder="BINANCE" className="input" />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={item?.status ?? "watching"} className="input">
            <option value="watching">Watching</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </Field>
      </div>

      <Field label="Thesis (markdown, educational framing)">
        <MarkdownEditor name="thesis_md" defaultValue={item?.thesis_md ?? ""} rows={6} />
      </Field>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save watchlist item"}
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
