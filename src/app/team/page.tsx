import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TeamGrid } from "@/components/team-grid";
import type { TeamMember } from "@/lib/types";

export const metadata: Metadata = {
  title: "Core Team",
  description: "The people behind Mochi Web3.",
};

export default async function TeamPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true });

  const team = (data ?? []) as TeamMember[];

  return (
    <div className="mw-team mw-team-page">
      <div className="mw-team-inner">
        <p className="mw-team-super">Mochi Web3 &middot; People</p>
        <h1>
          Meet the <em>Core Team</em>
        </h1>
        <p className="mw-team-intro">
          The people behind Mochi Web3 &mdash; traders, builders, and educators united by one
          mission.
        </p>

        <TeamGrid members={team} />
      </div>
    </div>
  );
}
