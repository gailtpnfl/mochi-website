import { TeamMemberForm } from "@/components/admin/team-member-form";

export default function NewTeamMemberPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New team member</h1>
      <div className="mt-6">
        <TeamMemberForm />
      </div>
    </div>
  );
}
