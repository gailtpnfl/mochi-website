import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { isRouteVisible, SOFT_LAUNCH } from "@/lib/site-visibility";

const STATIC_ROUTES = [
  "",
  "/story",
  "/team",
  "/community",
  "/airdrops",
  "/partners",
  "/learn",
  "/tradingview",
  "/tools",
  "/tools/bigboss-calculator",
  "/tools/watchlist",
  "/tools/fvg-indicator",
  "/tools/crypto-city",
  "/jobs",
  "/mentorship",
  "/nft",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.filter((route) =>
    isRouteVisible(route),
  ).map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  // Every dynamic entry below lives under a route that soft launch takes down,
  // so there is nothing worth querying for while it is on.
  if (SOFT_LAUNCH) return staticEntries;

  const supabase = await createClient();
  const [{ data: airdrops }, { data: courses }, { data: lessons }, { data: jobs }, { data: nftCollections }] =
    await Promise.all([
      supabase.from("airdrops").select("slug, updated_at").eq("is_archived", false),
      supabase.from("courses").select("id, slug, updated_at").eq("is_published", true),
      supabase.from("lessons").select("course_id, slug, updated_at").eq("is_published", true),
      supabase.from("job_postings").select("slug, posted_at").eq("status", "open"),
      supabase.from("nft_collections").select("slug, updated_at").eq("is_published", true),
    ]);

  const courseSlugById = new Map((courses ?? []).map((c) => [c.id, c.slug as string]));

  // Opportunities/NFT can be hidden independent of SOFT_LAUNCH (see
  // HIDDEN_ROUTES in site-visibility.ts) — skip their dynamic entries too,
  // not just the static ones, or the sitemap would list dead-end redirects.
  const airdropEntries: MetadataRoute.Sitemap = isRouteVisible("/airdrops")
    ? (airdrops ?? []).map((a) => ({
        url: `${siteUrl}/airdrops/${a.slug}`,
        lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
      }))
    : [];

  const courseEntries: MetadataRoute.Sitemap = (courses ?? []).map((c) => ({
    url: `${siteUrl}/learn/${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
  }));

  const lessonEntries: MetadataRoute.Sitemap = (lessons ?? [])
    .filter((l) => courseSlugById.has(l.course_id))
    .map((l) => ({
      url: `${siteUrl}/learn/${courseSlugById.get(l.course_id)}/${l.slug}`,
      lastModified: l.updated_at ? new Date(l.updated_at) : new Date(),
    }));

  const jobEntries: MetadataRoute.Sitemap = isRouteVisible("/jobs")
    ? (jobs ?? []).map((j) => ({
        url: `${siteUrl}/jobs/${j.slug}`,
        lastModified: j.posted_at ? new Date(j.posted_at) : new Date(),
      }))
    : [];

  const nftEntries: MetadataRoute.Sitemap = isRouteVisible("/nft")
    ? (nftCollections ?? []).map((c) => ({
        url: `${siteUrl}/nft/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
      }))
    : [];

  return [
    ...staticEntries,
    ...airdropEntries,
    ...courseEntries,
    ...lessonEntries,
    ...jobEntries,
    ...nftEntries,
  ];
}
