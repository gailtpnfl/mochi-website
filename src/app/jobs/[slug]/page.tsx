import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Markdown } from "@/components/markdown";
import type { JobPosting } from "@/lib/types";

type Params = Promise<{ slug: string }>;

const TYPE_LABEL: Record<JobPosting["type"], string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  volunteer: "Volunteer",
};

async function getJob(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("job_postings")
    .select("*")
    .eq("slug", slug)
    .eq("status", "open")
    .maybeSingle();
  return data as JobPosting | null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return { title: "Role not found" };
  return { title: job.title };
}

export default async function JobDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/jobs" className="text-sm text-muted hover:text-foreground">
        &larr; Job Opportunities
      </Link>
      <h1 className="section-title mt-3">{job.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {job.org} &middot; {job.location} &middot; {TYPE_LABEL[job.type]}
      </p>

      {job.description_md && (
        <div className="mt-8">
          <Markdown>{job.description_md}</Markdown>
        </div>
      )}

      {job.apply_url && (
        <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
          Apply
        </a>
      )}
    </div>
  );
}
