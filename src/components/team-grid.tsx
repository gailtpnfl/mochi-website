import type { TeamMember } from "@/lib/types";
import "./team-grid.css";

/* The reference's four card gradients, in its order, cycled across the roster.
   Token-based rather than hex so they track the palette — see
   design-reference/sections/_about-overlay.html. */
const GRADIENTS = [
  "linear-gradient(135deg, var(--accent3), var(--teal))",
  "linear-gradient(135deg, var(--teal), var(--accent))",
  "linear-gradient(135deg, var(--accent), var(--accent3))",
  "linear-gradient(135deg, var(--pink), var(--accent))",
];

const gradient = (i: number) => GRADIENTS[i % GRADIENTS.length];

/** First + last initial for full names ("Grace Ann Tomaneng" -> GT), first two
 *  letters for single-word handles ("RoadToMillions" -> RO). */
const initials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const raw = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2);
  return raw.toUpperCase();
};

/**
 * The Core Team as a flat card grid, matching the design reference's
 * `.ao-team-grid` (sections/_about-overlay.html). The card schema is the
 * reference's exactly: avatar → name → role → bio, with no handle line.
 * Members render in roster order — the tier field is not used for layout.
 *
 * Rendered on /team and inside the landing page's About overlay, so both stay
 * in sync from one roster.
 */
export function TeamGrid({ members }: { members: TeamMember[] }) {
  // A card with no bio is a mostly-empty box, so a member without one is left
  // off the grid rather than shipped hollow. Fill in `bio_md` to list them.
  const listed = members.filter((m) => m.bio_md);

  if (listed.length === 0) {
    return <p className="mw-team-empty">Team profiles are coming soon.</p>;
  }

  return (
    <div className="mw-team-grid">
      {listed.map((m, i) => (
        <div className="mw-team-person" key={m.id}>
          {/* PLACEHOLDER: avatar_url is null across the roster, so every card
              falls back to initials on a gradient. */}
          <div className="mw-team-avatar" style={{ background: gradient(i) }} aria-hidden>
            {initials(m.display_name)}
          </div>
          <div className="mw-team-name">{m.display_name}</div>
          <div className="mw-team-role">{m.role_title}</div>
          <p className="mw-team-bio">{m.bio_md}</p>
        </div>
      ))}
    </div>
  );
}
