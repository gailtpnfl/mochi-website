import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteTeamMember } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import type { TeamMember } from "@/lib/types";

export default async function AdminTeamPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("team_members").select("*").order("position");

  const team = (data ?? []) as TeamMember[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team members</h1>
        <Link
          href="/admin/team/new"
          className="rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-4 py-2 text-sm font-medium text-white"
        >
          New member
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {team.map((m) => (
          <div key={m.id} className="mw-card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {m.display_name} {!m.is_active && <span className="text-xs text-muted">(inactive)</span>}
              </p>
              <p className="text-xs text-muted">
                {m.role_title} &middot; {m.tier.replace("_", " ")} &middot; position {m.position}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link href={`/admin/team/${m.id}/edit`} className="text-xs text-muted hover:text-foreground">
                Edit
              </Link>
              <DeleteButton action={deleteTeamMember.bind(null, m.id)} confirmMessage={`Delete "${m.display_name}"?`} />
            </div>
          </div>
        ))}
        {team.length === 0 && <p className="text-sm text-muted">No team members yet.</p>}
      </div>
    </div>
  );
}
