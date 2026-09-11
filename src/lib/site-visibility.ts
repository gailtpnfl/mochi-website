/**
 * Soft-launch gate.
 *
 * While `SOFT_LAUNCH` is true the public site is limited to the landing page,
 * Our Story, Core Team, and Partnership. Everything else is delinked from the
 * nav/footer, redirected to `/` by `proxy.ts`, and dropped from `sitemap.xml`.
 *
 * To restore the full site: set `SOFT_LAUNCH` to false. That is the only edit
 * needed — every consumer derives its behaviour from this flag.
 */
export const SOFT_LAUNCH = false;

/** Pages the public can reach during soft launch. Matched exactly. */
export const PUBLIC_ROUTES = ["/", "/story", "/core-team", "/team", "/partners"] as const;

/**
 * Reachable regardless of soft launch, matched as prefixes.
 *
 * Legal pages stay up because the footer links them; `/admin`, `/api` and the
 * metadata routes have to keep working for the app to function at all
 * (`/sitemap.xml` is matched by the proxy matcher, so omitting it here would
 * redirect search engines to the landing page).
 *
 * There is no `/login` or `/auth` entry: sign-in was removed from the project,
 * so those routes no longer exist.
 */
const ALWAYS_ALLOWED_PREFIXES = [
  "/terms",
  "/privacy",
  "/admin",
  "/api",
  "/sitemap.xml",
  "/robots.txt",
];

/**
 * Hidden independent of `SOFT_LAUNCH` — Opportunities (airdrop hunting + job
 * listings) and NFT Collections aren't ready to publicize yet, so keep them
 * delinked and redirected even with the rest of the site live. Matched as
 * prefixes, same as `ALWAYS_ALLOWED_PREFIXES`. Mirrors `LANDING_SECTIONS`'
 * `opportunities`/`nft` flags and `SHOW_MERCH_LINK` below — flip all of them
 * together to bring a section back.
 */
const HIDDEN_ROUTES = ["/airdrops", "/jobs", "/nft"];

/** True when `pathname` should be served. Safe on both server and client. */
export function isRouteVisible(pathname: string): boolean {
  // Strip any query string / hash before matching (e.g. "/?about=1" used to
  // deep-link the About overlay open from other pages should match "/").
  const withoutQuery = pathname.split(/[?#]/)[0];

  // Normalise "" (used by the sitemap for home) and any trailing slash.
  const path = withoutQuery === "" ? "/" : withoutQuery.replace(/(.)\/+$/, "$1");

  if (HIDDEN_ROUTES.some((p) => path === p || path.startsWith(`${p}/`))) return false;

  if (!SOFT_LAUNCH) return true;

  if ((PUBLIC_ROUTES as readonly string[]).includes(path)) return true;

  return ALWAYS_ALLOWED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

/**
 * Landing-page sections. The soft-launch ones all advertise pages that soft
 * launch takes down, so leaving them up would point visitors at redirects.
 *
 * Testimonials stay up: the section is self-contained quotes with no links out,
 * so nothing in it depends on a gated page.
 *
 * Funded and events are the same shape as testimonials — self-contained, no
 * links out — but both still carry placeholder content (the IGN chips read "—",
 * the event photos are empty slots). Flip either to `false` to pull it until the
 * real content lands.
 *
 * Opportunities, merch, and nft are hidden explicitly for now (not tied to
 * `SOFT_LAUNCH`) — set alongside `HIDDEN_ROUTES` and `SHOW_MERCH_LINK` above/
 * below so nav, footer, and homepage stay consistent. Flip all three back to
 * `true` together when ready.
 */
export const LANDING_SECTIONS = {
  story: true,
  whatWeOffer: true,
  opportunities: false,
  merch: false,
  nft: false,
  testimonials: true,
  funded: true,
  events: true,
  partnership: true,
  join: true,
} as const;

/**
 * The Merch nav/footer entry points at an external store. It is hidden with the
 * on-page Merch section rather than with the route gate, since it is not a
 * route this app serves. Hidden explicitly for now — see `LANDING_SECTIONS`.
 */
export const SHOW_MERCH_LINK = false;
