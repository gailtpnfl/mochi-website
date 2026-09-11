import { CohortForm } from "@/components/admin/cohort-form";

export default function NewCohortPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New cohort</h1>
      <div className="mt-6">
        <CohortForm />
      </div>
    </div>
  );
}
