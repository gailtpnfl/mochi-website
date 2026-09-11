import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteCohort } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import type { Cohort } from "@/lib/types";

export default async function AdminCohortsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("cohorts").select("*").order("starts_at", { ascending: false });

  const cohorts = (data ?? []) as Cohort[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cohorts</h1>
        <Link
          href="/admin/cohorts/new"
          className="rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-4 py-2 text-sm font-medium text-white"
        >
          New cohort
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {cohorts.map((c) => (
          <div key={c.id} className="mw-card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{c.name}</p>
              <p className="text-xs capitalize text-muted">{c.status}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link href={`/admin/cohorts/${c.id}`} className="text-xs text-muted hover:text-foreground">
                Manage
              </Link>
              <DeleteButton action={deleteCohort.bind(null, c.id)} confirmMessage={`Delete "${c.name}"?`} />
            </div>
          </div>
        ))}
        {cohorts.length === 0 && <p className="text-sm text-muted">No cohorts yet.</p>}
      </div>
    </div>
  );
}
