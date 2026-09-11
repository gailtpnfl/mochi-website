"use client";

import { useState } from "react";
import { JournalEntryForm } from "@/components/journal-entry-form";

export function AddJournalEntry() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        New entry
      </button>
    );
  }

  return <JournalEntryForm onSaved={() => setOpen(false)} />;
}
