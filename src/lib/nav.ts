import { isRouteVisible } from "./site-visibility";

export interface NavLink {
  label: string;
  href?: string;
  phase: 1 | 2 | 3 | 4;
  external?: boolean;
  children?: { label: string; href: string; phase: 1 | 2 | 3 | 4 }[];
}

export const NAV_LINKS: NavLink[] = [
  // These four top-level links all scroll to a section of the landing page
  // rather than navigating to a separate route — "/#id" resolves to home
  // and Next's Link scrolls the matching element into view, both from "/"
  // itself (soft nav) and from any other page (after the route change).
  //
  // Our Story → the "About Us" section (`id="story"` in about-section.tsx).
  // It no longer opens the About overlay on click — that overlay is still
  // reachable via the "Learn more about us" button inside that section.
  { label: "Our Story", href: "/#story", phase: 1 },
  // → the Education panel, the first (default) panel of the "What We Offer"
  // scroll slider (`id="what-we-offer"` in offer-slider.tsx). No dropdown —
  // Learn Web3 and Mentorship are still reachable from the footer's "Learn"
  // column; Crypto Trading 101 lives inside /learn itself. TradingView
  // (/tradingview) has no nav/footer entry point left after this — visit it
  // directly, or say so if it should be added back somewhere.
  { label: "Learn", href: "/#what-we-offer", phase: 2 },
  {
    label: "Opportunities",
    phase: 1,
    children: [
      { label: "Airdrop Hunting", href: "/airdrops", phase: 1 },
      { label: "Job Opportunities", href: "/jobs", phase: 3 },
    ],
  },
  // Was "Trading Materials" (→ /tools, with a Tools dropdown) — replaced by
  // a single link to Community Testimonials (`id="community-love"` in
  // Testimonials.tsx). The Tools pages are still reachable from the footer's
  // "Tools" column.
  { label: "Community", href: "/#community-love", phase: 2 },
  {
    label: "Collections",
    phase: 4,
    children: [{ label: "NFT Collections", href: "/nft", phase: 4 }],
  },
  // → the Partnership CTA section (`id="partnership"` in page.tsx), not the
  // standalone /partners page — that page is still reachable from the
  // footer's "Partner With Us" link and the section's own CTA button.
  { label: "Partnership", href: "/#partnership", phase: 1 },
];

export const MERCH_LINK = {
  label: "Merch",
  href: process.env.NEXT_PUBLIC_MERCH_URL || "#",
  phase: 4 as const,
};

/**
 * `NAV_LINKS` with soft-launch-hidden destinations removed — a group whose
 * children are all hidden drops out entirely rather than rendering an empty
 * dropdown. Render from this, not `NAV_LINKS`.
 */
export const VISIBLE_NAV_LINKS: NavLink[] = NAV_LINKS.reduce<NavLink[]>((acc, link) => {
  const children = link.children?.filter((child) => isRouteVisible(child.href));
  const selfVisible = link.href ? isRouteVisible(link.href) : false;

  if (children?.length) {
    acc.push({ ...link, href: selfVisible ? link.href : undefined, children });
  } else if (selfVisible) {
    acc.push({ ...link, children: undefined });
  }

  return acc;
}, []);
