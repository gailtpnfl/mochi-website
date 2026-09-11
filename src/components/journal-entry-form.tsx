"use client";

import { useActionState } from "react";
import { saveJournalEntry } from "@/app/journal/actions";
import type { JournalEntry } from "@/lib/types";

type ActionState = { error?: string; ok?: boolean } | undefined;

export function JournalEntryForm({
  entry,
  onSaved,
}: {
  entry?: JournalEntry;
  onSaved?: () => void;
}) {
  const boundAction = saveJournalEntry.bind(null, entry?.id ?? null);
  const [state, action, pending] = useActionState<ActionState, FormData>(async (prev, formData) => {
    const result = await boundAction(prev, formData);
    if (result?.ok) onSaved?.();
    return result;
  }, undefined);

  return (
    <form action={action} className="mw-card grid gap-4 p-6 sm:grid-cols-2">
      <Field label="Date *">
        <input type="date" name="traded_at" required defaultValue={entry?.traded_at} className="input" />
      </Field>
      <Field label="Symbol *">
        <input name="symbol" required defaultValue={entry?.symbol} className="input" />
      </Field>
      <Field label="Direction">
        <select name="direction" defaultValue={entry?.direction ?? "long"} className="input">
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
      </Field>
      <Field label="Outcome">
        <select name="outcome" defaultValue={entry?.outcome ?? "open"} className="input">
          <option value="open">Open</option>
          <option value="win">Win</option>
          <option value="loss">Loss</option>
          <option value="breakeven">Breakeven</option>
        </select>
      </Field>
      <Field label="Entry price">
        <input type="number" step="any" name="entry_price" defaultValue={entry?.entry_price ?? ""} className="input" />
      </Field>
      <Field label="Exit price">
        <input type="number" step="any" name="exit_price" defaultValue={entry?.exit_price ?? ""} className="input" />
      </Field>
      <Field label="Stop price">
        <input type="number" step="any" name="stop_price" defaultValue={entry?.stop_price ?? ""} className="input" />
      </Field>
      <Field label="Size">
        <input type="number" step="any" name="size" defaultValue={entry?.size ?? ""} className="input" />
      </Field>
      <Field label="Leverage">
        <input type="number" step="any" name="leverage" defaultValue={entry?.leverage ?? ""} placeholder="e.g. 50" className="input" />
      </Field>
      <Field label="Margin">
        <input type="number" step="any" name="margin" defaultValue={entry?.margin ?? ""} placeholder="e.g. 1000" className="input" />
      </Field>
      <Field label="R multiple">
        <input
          type="number"
          step="any"
          name="r_multiple"
          defaultValue={entry?.r_multiple ?? ""}
          placeholder="e.g. 2 = won 2× your risk"
          className="input"
        />
      </Field>
      <Field label="Screenshot URL">
        <input
          name="screenshot_url"
          type="url"
          inputMode="url"
          autoComplete="off"
          defaultValue={entry?.screenshot_url ?? ""}
          placeholder="https://… (optional)"
          className="input"
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Notes">
          <textarea name="notes_md" rows={3} defaultValue={entry?.notes_md ?? ""} className="input" />
        </Field>
      </div>

      {state?.error && <p className="text-sm text-red-400 sm:col-span-2">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60 sm:col-span-2"
      >
        {pending ? "Saving..." : entry ? "Save changes" : "Add entry"}
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
