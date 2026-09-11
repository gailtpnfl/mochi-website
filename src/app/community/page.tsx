import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Markdown } from "@/components/markdown";
import type { Announcement } from "@/lib/types";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the Mochi Discord and see the latest community announcements.",
};

const GUIDELINES_MD = `
- Be respectful. Disagreement is fine, harassment isn't.
- No shilling private DMs, no unsolicited "signals," no scam links.
- Trading and airdrop content here is educational &mdash; never financial advice.
- Report scams and suspicious links to a moderator immediately.
`;

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(5);

  const announcements = (data ?? []) as Announcement[];
  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/ZGJm8vKUbz";

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="section-title">Community</h1>
      <p className="section-sub">
        Mochi lives on Discord. Airdrop alerts, trading education, and a community that
        catches scams before they spread.
      </p>

      <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">
        Join the Discord
      </a>

      <section className="mt-14">
        <h2 className="text-xl font-bold">Community guidelines</h2>
        <div className="mt-4">
          <Markdown>{GUIDELINES_MD}</Markdown>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold">Latest announcements</h2>
        <div className="mt-4 flex flex-col gap-4">
          {announcements.length === 0 && (
            <p className="text-sm text-muted">No announcements yet.</p>
          )}
          {announcements.map((a) => (
            <div key={a.id} className="mw-card mw-card-lift p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{a.title}</h3>
                {a.published_at && (
                  <span className="text-xs text-muted">
                    {new Date(a.published_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <Markdown>{a.body_md}</Markdown>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
