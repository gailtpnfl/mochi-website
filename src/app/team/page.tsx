import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { TeamGrid } from "@/components/team-grid";
import type { TeamMember } from "@/lib/types";

export const metadata: Metadata = {
  title: "Core Team",
  description: "The people behind Mochi Web3.",
};

export default async function TeamPage() {
  // No live Supabase project yet — degrade to an empty grid instead of
  // crashing this (public, always-reachable) page. See isSupabaseConfigured.
  let team: TeamMember[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("position", { ascending: true });

    team = (data ?? []) as TeamMember[];
  }

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
