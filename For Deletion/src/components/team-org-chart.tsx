import type { TeamMember, TeamTier } from "@/lib/types";
import "./team-org-chart.css";

/* Avatar gradients, cycled by index so adjacent cards never repeat. */
const GRADIENTS = [
  "linear-gradient(135deg, #9522e6, #6d5cf0)",
  "linear-gradient(135deg, #6d5cf0, #7aa0f0)",
  "linear-gradient(135deg, #a24bf0, #7c3aed)",
  "linear-gradient(135deg, #7aa0f0, #5ef0d2)",
  "linear-gradient(135deg, #9333ea, #c04bd6)",
  "linear-gradient(135deg, #6366f1, #9522e6)",
  "linear-gradient(135deg, #5ef0d2, #6d5cf0)",
];

const gradient = (i: number) => GRADIENTS[i % GRADIENTS.length];

/** First + last initial for full names ("Grace Ann Tomaneng" -> GT), first two
 *  letters for single-word handles ("RoadToMillions" -> RO). */
const initials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const raw =
    parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2);
  return raw.toUpperCase();
};

function Avatar({ name, index }: { name: string; index: number }) {
  return (
    <div className="mw-team-avatar" style={{ background: gradient(index) }} aria-hidden>
      {initials(name)}
    </div>
  );
}

/**
 * The full team hierarchy: founder -> leadership -> trading managers ->
 * director -> moderators. Rendered on /team and inside the landing page's
 * About overlay, so both stay in sync from one roster.
 */
export function TeamOrgChart({ members }: { members: TeamMember[] }) {
  const byTier = (tier: TeamTier) => members.filter((m) => m.tier === tier);

  const founder = byTier("founder")[0];
  const leaders = byTier("leadership");
  const managers = byTier("trading_manager");
  const director = byTier("director")[0];
  const mods = byTier("moderator");

  if (members.length === 0) {
    return <p className="mw-team-panel-note">Team profiles are coming soon.</p>;
  }

  return (
    <>
      {founder && (
        <div className="mw-team-founder-row">
          <div className="mw-team-card mw-team-founder">
            <Avatar name={founder.display_name} index={0} />
            <div>
              <span className="mw-team-badge">{founder.role_title}</span>
              <div className="mw-team-name">{founder.display_name}</div>
              {founder.ign && <div className="mw-team-ign">{founder.ign}</div>}
              {founder.bio_md && <p className="mw-team-bio">{founder.bio_md}</p>}
            </div>
          </div>
        </div>
      )}

      {leaders.length > 0 && (
        <>
          <p className="mw-team-connector">Leadership</p>
          <div className="mw-team-leaders">
            {leaders.map((m, i) => (
              <div className="mw-team-card" key={m.id}>
                <Avatar name={m.display_name} index={i} />
                <div className="mw-team-name">{m.display_name}</div>
                {m.ign && <div className="mw-team-ign">{m.ign}</div>}
                <div className="mw-team-role">{m.role_title}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {managers.length > 0 && (
        <div className="mw-team-card mw-team-panel">
          <div className="mw-team-panel-head">
            <div className="mw-team-panel-title">Trading Managers</div>
          </div>
          <div className="mw-team-managers">
            {managers.map((m, i) => (
              <div className="mw-team-chip" key={m.id}>
                <Avatar name={m.display_name} index={i} />
                <span>{m.display_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {director && (
        <div className="mw-team-director-row">
          <div className="mw-team-card mw-team-director">
            <Avatar name={director.display_name} index={4} />
            <div>
              <div className="mw-team-name">{director.display_name}</div>
              {director.ign && <div className="mw-team-ign">{director.ign}</div>}
              <div className="mw-team-role">{director.role_title}</div>
            </div>
          </div>
        </div>
      )}

      {mods.length > 0 && (
        <div className="mw-team-card mw-team-panel">
          <div className="mw-team-panel-head">
            <div className="mw-team-panel-title">Community Moderators</div>
            <div className="mw-team-panel-note">Keeping the community running, every day</div>
          </div>
          <div className="mw-team-mods">
            {mods.map((m, i) => (
              <div className="mw-team-pill" key={m.id}>
                <Avatar name={m.display_name} index={i} />
                <span>{m.display_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
