import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { JobPosting } from "@/lib/types";

export const metadata: Metadata = {
  title: "Job Opportunities",
  description: "Open roles across Mochi and Mochi Agency.",
};

const TYPE_LABEL: Record<JobPosting["type"], string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  volunteer: "Volunteer",
};

export default async function JobsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("job_postings")
    .select("*")
    .eq("status", "open")
    .order("posted_at", { ascending: false });

  const jobs = (data ?? []) as JobPosting[];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <span className="section-eyebrow">07 &middot; Careers</span>
      <h1 className="section-title">Job Opportunities</h1>
      <p className="section-sub">
        Open roles across Mochi and Mochi Agency.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        {jobs.map((job) => (
          <Link key={job.id} href={`/jobs/${job.slug}`} className="mw-card mw-card-lift flex flex-wrap items-center justify-between gap-2 p-5">
            <div>
              <h2 className="font-bold">{job.title}</h2>
              <p className="text-xs text-muted">
                {job.org} &middot; {job.location}
              </p>
            </div>
            <span className="chip chip-muted">{TYPE_LABEL[job.type]}</span>
          </Link>
        ))}
        {jobs.length === 0 && <p className="text-sm text-muted">No open roles right now.</p>}
      </div>
    </div>
  );
}
