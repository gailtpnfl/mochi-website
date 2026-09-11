/**
 * Core Team roster.
 *
 * Source of truth for /core-team. Real names, handles, and social links come
 * from `1/uploads/Mentors.xlsx`; roles and blurbs from the approved redesign
 * (`1/uploads/core-team-page.html`).
 *
 * NOTE: this is a static array, while /team renders the same organisation from
 * the Supabase `team_members` table. The two rosters are not in sync and the
 * admin UI does not reach this file. See the handover notes before adding
 * anyone.
 */

export interface CoreTeamSocials {
  fb?: string;
  x?: string;
  yt?: string;
  in?: string;
}

export interface CoreTeamMember {
  name: string;
  handle: string;
  role?: string;
  blurb?: string;
  /** Path under /public once photography lands; initials render until then. */
  photo?: string;
  socials?: CoreTeamSocials;
}

export interface CoreTeamGroups {
  founder: CoreTeamMember[];
  leadership: CoreTeamMember[];
  mentors: CoreTeamMember[];
  moderators: CoreTeamMember[];
}

export const coreTeam: CoreTeamGroups = {
  // Christer previously had his own "Founder" tier/feature slot; moved into
  // Leadership (first, ahead of Sheyenne) per the roster owner — role/blurb
  // unchanged.
  founder: [],

  leadership: [
    {
      name: "Christer Saromines",
      handle: "@BigDaddyDaks",
      role: "Founder",
      blurb: "In charge of the strategic direction of the overall group.",
      photo: "/images/team/christer-saromines.webp",
    },
    {
      name: "Sheyenne Shamir Pagulayan",
      handle: "@Thursday",
      role: "Chief of Operations",
      blurb:
        "Spearheads all organization activities and day-to-day management, including the community manager and one-downs.",
    },
    {
      // @Patatas is Abegail Joyce Peñafiel — one person. An earlier pass split
      // this row on the understanding they were two, then the roster owner
      // confirmed the original pairing was right.
      name: "Abegail Joyce Peñafiel",
      handle: "@Patatas",
      role: "Chief Technology Officer",
      blurb: "In charge of technology development and the security of all assets.",
      photo: "/images/team/abegail-penafiel.webp",
    },
    {
      name: "Grace Ann Tomaneng",
      handle: "@Gureishi",
      role: "Chief Marketing Officer",
      blurb: "In charge of all marketing initiatives for the group and campaign development.",
      photo: "/images/team/grace-tomaneng.webp",
    },
    {
      name: "Jose Gabriel Fornier",
      handle: "@Gub",
      role: "Chief Commercial Officer",
      blurb:
        "In charge of all sales, business development, and proposal management for bidding and special projects.",
      photo: "/images/team/jose-fornier.webp",
    },
    {
      name: "Miguel Leonido Cura",
      handle: "@Rengoku",
      role: "Director of Community",
      blurb:
        "Leads the member experience end to end — onboarding, regional events, and the mentor and moderator teams.",
    },
  ],

  // The redesign shipped two mentors (slot ids ct-m3 and ct-m6). Mentors.xlsx
  // lists seven. All five that were marked `pending` and commented out
  // (because the redesign dropped them) are now confirmed and restored
  // below, in the order requested.
  mentors: [
    {
      name: "Div Anthony Boy Ragsac",
      handle: "@Ryzen",
      socials: { fb: "https://www.facebook.com/ryzentrades" },
      photo: "/images/team/div-ragsac.webp",
    },
    {
      name: "Rico Mendoza",
      handle: "@CryptoBeast",
      socials: { fb: "https://www.facebook.com/MochiCryptoBeast" },
      photo: "/images/team/cryptobeast.webp",
    },
    {
      name: "Arnie B. Buan",
      handle: "@Kalmado",
      socials: { fb: "https://www.facebook.com/D0NKALMADO", x: "https://x.com/KalmadoNFT" },
      photo: "/images/team/kalmado.webp",
    },
    {
      name: "Genesis Meil Dizon",
      handle: "@RoadToMillions",
      photo: "/images/team/roadtomillions.webp",
      socials: { fb: "https://www.facebook.com/roadtomillionsss/", in: "https://www.linkedin.com/in/genesismeildizon/" },
    },
    {
      name: "Christopher Dela Cruz",
      handle: "@Topee",
      photo: "/images/team/christopher-dela-cruz.webp",
    },
    {
      name: "Glenn Jason Concon",
      handle: "@AngCool",
    },
    // { name: "Glenn Jason Concon",  handle: "@AngCool" },
  ],

  moderators: [
    {
      name: "Rico Ramirez",
      handle: "@4ricoswabe",
      socials: {
        fb: "https://www.facebook.com/4ricoswabeh",
        x: "https://x.com/4ricoswabe",
        yt: "https://www.youtube.com/@4ricoswabe",
      },
      photo: "/images/team/rico-ramirez.webp",
    },
    {
      name: "John Eric Obog",
      handle: "@plasma.skr",
      socials: { fb: "https://www.facebook.com/share/1Kc5gM1Q21/" },
      photo: "/images/team/john-eric-obog.webp",
    },
    {
      name: "Mark Anthony Mariano",
      handle: "@chekwahmariano",
      socials: {
        fb: "https://www.facebook.com/chekwah.mariano/",
        x: "https://x.com/ChekwahMariano",
      },
      photo: "/images/team/mark-mariano.webp",
    },
    {
      name: "Mohammad Yusoph Lampa",
      handle: "@mhmmdlmp",
      socials: { in: "http://www.linkedin.com/in/mohammad-yusoph-lampa-054555352" },
      photo: "/images/team/mohammad-lampa.webp",
    },
    {
      name: "Daniel Custodio",
      handle: "@DDDD",
      photo: "/images/team/daniel-custodio.webp",
    },
    {
      name: "Shawn Michael Gonzales",
      handle: "@Shawnny",
      photo: "/images/team/shawn-gonzales.webp",
    },
  ],
};

export const CORE_TEAM_GROUP_ORDER = [
  "founder",
  "leadership",
  "mentors",
  "moderators",
] as const satisfies readonly (keyof CoreTeamGroups)[];

/**
 * Masthead stat strip. Derived, never hardcoded — the redesign's literals
 * (14 / 05 / 02 / 06) drift the moment anyone is added or removed.
 *
 * "Tiers" counts groups that actually have members. The redesign printed 05
 * against four groups; see design-reference/OPEN-QUESTIONS.md.
 */
export function coreTeamStats() {
  const groups = CORE_TEAM_GROUP_ORDER.map((key) => coreTeam[key]);

  return [
    { value: groups.reduce((n, g) => n + g.length, 0), label: "People" },
    { value: groups.filter((g) => g.length > 0).length, label: "Tiers" },
    { value: coreTeam.mentors.length, label: "Mentors" },
    { value: coreTeam.moderators.length, label: "Moderators" },
  ];
}

/** Zero-padded to two digits, matching the redesign's numerals. */
export const pad2 = (n: number) => String(n).padStart(2, "0");

/** First + last initial, or the first two letters of a single-word name. */
export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const raw = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2);
  return raw.toUpperCase();
}

/** Strips the leading "@" from a handle — the public-facing display name
 * everywhere on the site now, in place of the real name in `CoreTeamMember.
 * name` (kept in the data only as the roster's internal record; see the
 * file header). */
export function handleName(handle: string) {
  return handle.replace(/^@/, "");
}
