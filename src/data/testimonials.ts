/**
 * Community testimonials.
 *
 * These are real survey responses from named members. Two rules apply:
 *
 *  1. `consentConfirmed` gates rendering — anything false is dropped from the
 *     page entirely, it is not merely hidden.
 *  2. Quotes are reproduced verbatim. The Taglish entries in particular are
 *     never translated, glossed, or "corrected" — "walang madamot magturo" and
 *     "may natatanungan kapag may questions" stay exactly as written.
 *
 * Quote marks are NOT part of the text; they are drawn by CSS so screen
 * readers don't announce them. Do not add them here.
 */

export type TestimonialTier = "hero" | "card" | "mini" | "inperson";

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  tenure: string;
  memberType?: "Mentee" | "General member";
  tag?: string;
  tier: TestimonialTier;
  variant?: "display";
  consentConfirmed: boolean;
  /**
   * Substring of `quote` the design renders in the gradient accent. Split at
   * render time so the quote itself stays one verbatim string — never markup
   * embedded in the text.
   */
  emphasis?: string;
}

/**
 * Headline community stats.
 *
 * TODO: these come from the design reference, not from a measured source.
 * "Community members 30K+" sits alongside the hero's "26K+ Members" —
 * different metrics (community vs active), but both need confirming before
 * launch.
 */
export const communityStats = [
  { label: "Community members", value: "30K+", caption: "and growing every week" },
  { label: "Airdrops unlocked", value: "75+" },
  { label: "Reach across socials", value: "5M+" },
] as const;

/** The wide peso-value card. Requires an adjacent disclaimer wherever shown. */
export const communityWinsPeso = "35,000,000";

export const testimonials: Testimonial[] = [
  {
    id: "koys",
    name: "Mochi | Koys",
    quote: "No gatekeeping. Proper risk management taught properly.",
    tenure: "3–6 months",
    memberType: "Mentee",
    tier: "hero",
    consentConfirmed: true,
    emphasis: "Proper risk management",
  },

  {
    id: "patricia",
    name: "Mochi | Patricia",
    quote:
      "Almost 2 years na ako dito, and sobrang open ng lahat sa pag-share ng knowledge. Libre lang yung mga learnings, walang madamot magturo. Hindi lang trading yung natututunan ko, pati yung tamang mindset para mag-grow.",
    tenure: "6+ months",
    memberType: "Mentee",
    tag: "Walang madamot",
    tier: "card",
    consentConfirmed: true,
  },
  {
    id: "sung-woo",
    name: "MOCHI | SUNG_WOO",
    quote:
      "Mochi Web3 is one of the best trading communities I've come across. It's more than a trading community, it's a place where traders learn, grow, and improve together.",
    tenure: "6+ months",
    memberType: "General member",
    tag: "Best all-around",
    tier: "card",
    consentConfirmed: true,
  },
  {
    id: "pabikog",
    name: "Mochi | Pabikog",
    quote:
      "The culture of learning and giving back. The sessions are consistently valuable, the community is welcoming, and knowledge is shared freely without pressure to buy anything.",
    tenure: "6+ months",
    memberType: "Mentee",
    tag: "No pressure to buy",
    tier: "card",
    consentConfirmed: true,
  },
  {
    id: "damu-lag",
    name: "DAMU LAG",
    quote:
      "Free learnings and guidance about trading. Mentors who are dedicated to what they do without expecting anything in return.",
    tenure: "6+ months",
    memberType: "Mentee",
    tier: "card",
    consentConfirmed: true,
  },
  {
    id: "w3bs-welcome",
    name: "Mochi | W3BS",
    quote:
      "From the moment I joined, the mentors and other members made me feel genuinely welcome, even as a complete newbie. They were patient, approachable, and always willing to answer my questions without making me feel out of place.",
    emphasis: "patient, approachable, and always willing to answer",
    tenure: "3–6 months",
    memberType: "General member",
    tag: "Starting from zero",
    tier: "card",
    consentConfirmed: true,
  },

  {
    id: "ken",
    name: "Mochi | Ken",
    quote: "Having zero knowledge until I learned bit by bit through the help of mentors.",
    tenure: "1–3 months",
    memberType: "Mentee",
    tier: "mini",
    consentConfirmed: true,
  },
  {
    id: "buralph",
    name: "MOCHI | BURALPH",
    quote:
      "The tutors and mentoring are all free — I love it, it's very rare in the crypto world. Plus the community is fun.",
    tenure: "6+ months",
    tier: "mini",
    consentConfirmed: true,
  },
  {
    id: "rare",
    name: "Rare",
    quote:
      "Being able to learn free trading knowledge, and grateful to all the mentors, admins and active members for always being helpful.",
    tenure: "6+ months",
    tier: "mini",
    consentConfirmed: true,
  },
  {
    id: "hide3264",
    name: "Hide3264",
    quote: "Approachable mentors.",
    tenure: "1–3 months",
    tier: "mini",
    variant: "display",
    consentConfirmed: true,
  },
  {
    id: "riisuix",
    name: "riisuix",
    quote:
      "I really love the sense of community here — and unique experiences like the Davao summer event.",
    tenure: "3–6 months",
    tier: "mini",
    consentConfirmed: true,
  },
  {
    id: "anonymous",
    name: "Anonymous",
    quote:
      "Araw-araw akong may natututunan sa walang sawang pagtuturo ng mochi mentors at analysts — lalo na sa risk management at trendlines.",
    tenure: "6+ months",
    memberType: "General member",
    tier: "mini",
    consentConfirmed: true,
  },
  {
    id: "mochi-z",
    name: "Mochi | Z",
    quote: "Free learnings, at may natatanungan kapag may questions.",
    tenure: "6+ months",
    tier: "mini",
    consentConfirmed: true,
  },

  {
    // Same handle as `w3bs-welcome`. The redesign carries both as separate
    // submissions; see the handover notes before consolidating.
    id: "w3bs-meetup",
    name: "Mochi | W3BS",
    quote:
      "I joined one of the recent in-person meetups and it made me appreciate the community even more. Even though I'm still a new trader, I never felt left out.",
    tenure: "3–6 months",
    tag: "In person",
    tier: "inperson",
    consentConfirmed: true,
  },
];

/** Only consented entries ever reach the page. */
export const visibleTestimonials = testimonials.filter((t) => t.consentConfirmed);

export const byTier = (tier: TestimonialTier) =>
  visibleTestimonials.filter((t) => t.tier === tier);

/**
 * Count shown in the "More from the community" rule. Derived, not hardcoded —
 * the redesign's literal `08` drifts the moment anyone is added.
 *
 * NOTE: this counts the mini tier only, which is the tier the rule sits above.
 * It is not the section total (14 quotes from 13 people, since Mochi | W3BS
 * appears twice). See design-reference/OPEN-QUESTIONS.md.
 */
export const miniCount = () => byTier("mini").length;

/** Zero-padded to two digits, matching the redesign's numerals. */
export const pad2 = (n: number) => String(n).padStart(2, "0");

/** "Mentee · 6+ months" — falls back to "Member" when no member type is recorded. */
export const metaLine = (t: Testimonial) =>
  [t.memberType ?? "Member", t.tenure].filter(Boolean).join(" · ");

/**
 * Avatar initials. Handles carry a "Mochi | " style prefix that would otherwise
 * swamp the result, so it is stripped first; then first+last initial for
 * multi-part names ("SUNG_WOO" -> SW), else the first two characters
 * ("Koys" -> KO, "W3BS" -> W3).
 */
export function initials(name: string) {
  const handle = name.includes("|") ? name.slice(name.lastIndexOf("|") + 1) : name;
  const parts = handle.trim().split(/[\s_]+/).filter(Boolean);
  const raw =
    parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : (parts[0] ?? name).slice(0, 2);
  return raw.toUpperCase();
}
