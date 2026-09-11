import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteJobPosting } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import type { JobPosting } from "@/lib/types";

export default async function AdminJobsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("job_postings").select("*").order("posted_at", { ascending: false });

  const jobs = (data ?? []) as JobPosting[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job postings</h1>
        <Link
          href="/admin/jobs/new"
          className="rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-4 py-2 text-sm font-medium text-white"
        >
          New posting
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {jobs.map((job) => (
          <div key={job.id} className="mw-card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{job.title}</p>
              <p className="text-xs text-muted capitalize">
                {job.status} &middot; {job.org}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link href={`/admin/jobs/${job.id}/edit`} className="text-xs text-muted hover:text-foreground">
                Edit
              </Link>
              <DeleteButton action={deleteJobPosting.bind(null, job.id)} confirmMessage={`Delete "${job.title}"?`} />
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-sm text-muted">No job postings yet.</p>}
      </div>
    </div>
  );
}
