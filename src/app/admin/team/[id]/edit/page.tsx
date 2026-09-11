import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TeamMemberForm } from "@/components/admin/team-member-form";
import type { TeamMember } from "@/lib/types";

type Params = Promise<{ id: string }>;

export default async function EditTeamMemberPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: member } = await supabase.from("team_members").select("*").eq("id", id).maybeSingle();

  if (!member) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit team member</h1>
      <div className="mt-6">
        <TeamMemberForm member={member as TeamMember} />
      </div>
    </div>
  );
}
