import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JobPostingForm } from "@/components/admin/job-posting-form";
import type { JobPosting } from "@/lib/types";

type Params = Promise<{ id: string }>;

export default async function EditJobPostingPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: job } = await supabase.from("job_postings").select("*").eq("id", id).maybeSingle();

  if (!job) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit job posting</h1>
      <div className="mt-6">
        <JobPostingForm job={job as JobPosting} />
      </div>
    </div>
  );
}
