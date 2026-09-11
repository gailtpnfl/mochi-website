import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AddJournalEntry } from "@/components/add-journal-entry";
import { JournalEntryList } from "@/components/journal-entry-list";
import type { JournalEntry } from "@/lib/types";

export const metadata: Metadata = {
  title: "Mochi Trading Journal",
  description: "Your private trade journal. Only you can see this.",
};

export default async function JournalPage() {
  const user = await getCurrentUser();
  // Sign-in was removed from the project, so there is nowhere to send an
  // unauthenticated visitor except back to the site.
  if (!user) redirect("/");

  const supabase = await createClient();
  const [{ data: entriesData }, { data: membership }] = await Promise.all([
    supabase.from("journal_entries").select("*").order("traded_at", { ascending: false }),
    supabase.from("cohort_members").select("cohort_id").eq("user_id", user.id).limit(1).maybeSingle(),
  ]);

  const entries = (entriesData ?? []) as JournalEntry[];
  const cohortId = (membership?.cohort_id as string | undefined) ?? null;

  const wins = entries.filter((e) => e.outcome === "win").length;
  const losses = entries.filter((e) => e.outcome === "loss").length;
  const decided = wins + losses;
  const winRate = decided > 0 ? ((wins / decided) * 100).toFixed(0) : null;
  const rValues = entries.map((e) => e.r_multiple).filter((r): r is number => r !== null);
  const avgR = rValues.length > 0 ? (rValues.reduce((a, b) => a + b, 0) / rValues.length).toFixed(2) : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="section-title">Mochi Trading Journal</h1>
      <p className="section-sub">
        Private to you. No one &mdash; including admins &mdash; can see your entries unless you
        explicitly share one to a mentor review.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <Stat label="Entries" value={String(entries.length)} />
        <Stat label="Win rate" value={winRate ? `${winRate}%` : "—"} />
        <Stat label="Avg R" value={avgR ?? "—"} />
      </div>

      <div className="mt-8">
        <AddJournalEntry />
      </div>

      <div className="mt-8">
        <JournalEntryList entries={entries} cohortId={cohortId} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="mw-card p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
