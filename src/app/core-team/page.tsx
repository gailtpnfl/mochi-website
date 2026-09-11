import type { Metadata } from "next";
import Link from "next/link";
import { PhotoSlot } from "@/components/core-team/photo-slot";
import { coreTeam, coreTeamStats, handleName, pad2, type CoreTeamSocials } from "@/data/coreTeam";
import "./core-team.css";

export const metadata: Metadata = {
  title: "Core Team",
  description: "The people behind Mochi Web3.",
};

const SOCIAL_ORDER: { key: keyof CoreTeamSocials; label: string }[] = [
  { key: "fb", label: "FB" },
  { key: "x", label: "X" },
  { key: "yt", label: "YT" },
  { key: "in", label: "IN" },
];

/** Social row, or the redesign's "SOON" placeholder when nobody has links yet. */
function Socials({ socials, soonLabel = "SOON" }: { socials?: CoreTeamSocials; soonLabel?: string }) {
  const links = SOCIAL_ORDER.filter(({ key }) => socials?.[key]);

  if (links.length === 0) {
    return <div className="ct-soon">{soonLabel}</div>;
  }

  return (
    <div className="ct-socials">
      {links.map(({ key, label }) => (
        <a key={key} href={socials?.[key]} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ))}
    </div>
  );
}

export default function CoreTeamPage() {
  const stats = coreTeamStats();
  const founder = coreTeam.founder[0];

  return (
    <div className="ct-page">
      <div className="ct-shell">
        <Link className="ct-back" href="/">
          ← Back to mochiworld
        </Link>
      </div>

      <div className="ct-body">
        <div className="ct-shell">
          {/* ══════════════ MASTHEAD ══════════════ */}
          <header className="ct-masthead">
            <div>
              <div className="ct-eyebrow">
                <span className="ct-dot" />
                <p>Mochi Web3 · Masthead</p>
              </div>
              <h1 className="ct-title">
                The Core
                <br />
                Team
              </h1>
            </div>
            <p className="ct-lede">
              Traders, builders, and educators united by one mission — making Web3 education free
              and accessible to all.
            </p>
          </header>

          <div className="ct-stats">
            {stats.map((s) => (
              <div className="ct-stat" key={s.label}>
                <div className="ct-stat-value">{pad2(s.value)}</div>
                <div className="ct-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ══════════════ FOUNDER ══════════════ */}
          {founder && (
            <section className="ct-founder">
              <PhotoSlot name={handleName(founder.handle)} photo={founder.photo} variant="founder" priority />
              <div className="ct-founder-text">
                <div className="ct-kicker">{founder.role}</div>
                <div className="ct-founder-name">{handleName(founder.handle)}</div>
                {founder.blurb && <p className="ct-founder-blurb">{founder.blurb}</p>}
              </div>
            </section>
          )}

          {/* ══════════════ LEADERSHIP ══════════════ */}
          <div className="ct-rule-head">
            <p className="ct-rule-title">Leadership</p>
            <div className="ct-rule-line" />
            <p className="ct-rule-note">C-Suite · What they own</p>
          </div>

          <section className="ct-rows">
            {coreTeam.leadership.map((m, i) => (
              <article className="ct-row" key={m.handle}>
                <div className="ct-row-num">{pad2(i + 1)}</div>
                <PhotoSlot name={handleName(m.handle)} photo={m.photo} variant="lead" />
                <div className="ct-row-id">
                  <div className="ct-row-name">{handleName(m.handle)}</div>
                  <div className="ct-row-role">{m.role}</div>
                </div>
                <p className="ct-row-blurb">{m.blurb}</p>
                <Socials socials={m.socials} soonLabel="Socials soon" />
              </article>
            ))}
          </section>

          {/* ══════════════ TRADING MENTORS ══════════════ */}
          <div className="ct-section-head">
            <div className="ct-rule-head ct-rule-head-plain">
              <p className="ct-rule-title">Trading Mentors</p>
              <div className="ct-rule-line" />
            </div>
            <p className="ct-section-note">
              Experienced traders who volunteer their time to guide members through the fundamentals
              — chart reading, risk management, and building a process you can repeat. Education
              only, never signals.
            </p>
          </div>

          <section className="ct-mentors">
            {coreTeam.mentors.map((m) => (
              <article className="ct-mentor" key={m.handle}>
                <PhotoSlot
                  name={handleName(m.handle)}
                  photo={m.photo}
                  variant="mentor"
                  imgClassName={m.handle === "@Ryzen" ? "ct-photo-zoom" : undefined}
                />
                <div className="ct-mentor-name">{handleName(m.handle)}</div>
                <Socials socials={m.socials} />
              </article>
            ))}
          </section>

          {/* ══════════════ COMMUNITY MODERATORS ══════════════ */}
          <div className="ct-section-head">
            <div className="ct-rule-head ct-rule-head-plain">
              <p className="ct-rule-title">Community Moderators</p>
              <div className="ct-rule-line" />
            </div>
            <p className="ct-section-note">
              Answer questions, keep the chats clean, and welcome every new member — every day.
            </p>
          </div>

          <section className="ct-mods">
            {coreTeam.moderators.map((m) => (
              <article className="ct-mod" key={m.handle}>
                <PhotoSlot name={handleName(m.handle)} photo={m.photo} variant="moderator" />
                <div className="ct-mod-id">
                  <div className="ct-mod-name">{handleName(m.handle)}</div>
                  <Socials socials={m.socials} />
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
