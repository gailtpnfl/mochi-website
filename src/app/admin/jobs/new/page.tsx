import { JobPostingForm } from "@/components/admin/job-posting-form";

export default function NewJobPostingPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New job posting</h1>
      <div className="mt-6">
        <JobPostingForm />
      </div>
    </div>
  );
}
