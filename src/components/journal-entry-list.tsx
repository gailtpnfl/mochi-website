"use client";

import { useState, useTransition } from "react";
import { deleteJournalEntry, shareEntryToReview } from "@/app/journal/actions";
import { JournalEntryForm } from "@/components/journal-entry-form";
import { Markdown } from "@/components/markdown";
import { TradeCardModal } from "@/components/trade-card";
import type { JournalEntry } from "@/lib/types";

const OUTCOME_STYLES: Record<string, string> = {
  win: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  loss: "bg-red-500/15 text-red-300 border-red-500/30",
  breakeven: "bg-white/5 text-muted border-border",
  open: "chip-muted",
};

export function JournalEntryList({
  entries,
  cohortId,
}: {
  entries: JournalEntry[];
  cohortId: string | null;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cardEntry, setCardEntry] = useState<JournalEntry | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => {
        if (editingId === entry.id) {
          return (
            <JournalEntryForm key={entry.id} entry={entry} onSaved={() => setEditingId(null)} />
          );
        }

        return (
          <div key={entry.id} className="mw-card mw-card-lift p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold">{entry.symbol}</span>
                <span className="text-xs capitalize text-muted">{entry.direction}</span>
                <span className="text-xs text-muted">{entry.traded_at}</span>
              </div>
              <span className={`chip capitalize ${OUTCOME_STYLES[entry.outcome ?? "open"]}`}>
                {entry.outcome ?? "open"}
              </span>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted sm:grid-cols-4">
              {entry.entry_price !== null && <span>Entry: {entry.entry_price}</span>}
              {entry.exit_price !== null && <span>Exit: {entry.exit_price}</span>}
              {entry.stop_price !== null && <span>Stop: {entry.stop_price}</span>}
              {entry.r_multiple !== null && <span>R: {entry.r_multiple}</span>}
            </div>

            {entry.notes_md && (
              <div className="mt-2">
                <Markdown>{entry.notes_md}</Markdown>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-border pt-3 text-xs">
              <button
                type="button"
                onClick={() => setEditingId(entry.id)}
                className="text-muted hover:text-foreground"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setCardEntry(entry)}
                className="text-muted hover:text-foreground"
              >
                Download card
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (confirm("Delete this entry?")) {
                    startTransition(() => deleteJournalEntry(entry.id));
                  }
                }}
                className="text-red-400 hover:underline disabled:opacity-50"
              >
                Delete
              </button>
              {cohortId && (
                <button
                  type="button"
                  disabled={pending || !!entry.shared_review_id}
                  onClick={() => {
                    const title = prompt("Title for this trade review?", `${entry.symbol} review`);
                    if (title) {
                      startTransition(() => {
                        void shareEntryToReview(entry.id, cohortId, title);
                      });
                    }
                  }}
                  className="text-muted hover:text-foreground disabled:opacity-50"
                >
                  {entry.shared_review_id ? "Shared with mentor" : "Share to mentor review"}
                </button>
              )}
            </div>
          </div>
        );
      })}
      {entries.length === 0 && <p className="text-sm text-muted">No entries yet.</p>}

      {cardEntry && (
        <TradeCardModal entry={cardEntry} onClose={() => setCardEntry(null)} />
      )}
    </div>
  );
}
