import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AboutSection } from "@/components/landing/about-section";
import type { TeamMember } from "@/lib/types";

/**
 * Fetches the team roster and renders AboutSection with it — split out of
 * page.tsx so this query can sit behind a <Suspense> boundary there instead
 * of blocking the whole homepage's initial paint (hero included) behind it.
 *
 * The org chart this feeds is inside the About overlay, which starts closed
 * and only opens on a click — nothing above the fold needs this data, so
 * there's no visible cost to it resolving a beat after the hero appears.
 * This is what made returning to "/" (e.g. closing the Partnership or
 * Mentorship overlays, both of which router.push("/")) feel slow: the whole
 * homepage used to wait on this query before rendering anything at all.
 *
 * There's no live Supabase project yet (see isSupabaseConfigured), so this
 * degrades to an empty roster instead of crashing the whole homepage —
 * AboutSection's own hand-drawn team strip (MeetTheTeamStrip) doesn't use
 * this data at all, it reads the static roster in @/data/coreTeam, so an
 * empty `team` here only affects the separate tiered org chart elsewhere in
 * the About overlay.
 */
export async function AboutSectionData() {
  if (!isSupabaseConfigured()) {
    return <AboutSection team={[]} />;
  }

  const supabase = await createClient();
  // Full roster — the About overlay renders the whole tiered org chart.
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("position");

  const team = (data ?? []) as TeamMember[];

  return <AboutSection team={team} />;
}
