import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [
    { count: airdropCount },
    { count: teamCount },
    { count: inquiryCount },
    { count: courseCount },
    { count: watchlistCount },
    { count: pendingApplicationCount },
    { count: submittedReviewCount },
    { count: openJobCount },
    { count: nftCollectionCount },
  ] = await Promise.all([
    supabase.from("airdrops").select("*", { count: "exact", head: true }),
    supabase.from("team_members").select("*", { count: "exact", head: true }),
    supabase.from("partnership_inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("watchlist_items").select("*", { count: "exact", head: true }),
    supabase.from("cohort_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("trade_reviews").select("*", { count: "exact", head: true }).eq("status", "submitted"),
    supabase.from("job_postings").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("nft_collections").select("*", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "Airdrops", count: airdropCount ?? 0, href: "/admin/airdrops" },
    { label: "Team members", count: teamCount ?? 0, href: "/admin/team" },
    { label: "New inquiries", count: inquiryCount ?? 0, href: "/admin/inquiries" },
    { label: "Courses", count: courseCount ?? 0, href: "/admin/courses" },
    { label: "Watchlist items", count: watchlistCount ?? 0, href: "/admin/watchlist" },
    { label: "Pending applications", count: pendingApplicationCount ?? 0, href: "/admin/cohorts" },
    { label: "Trade reviews to take", count: submittedReviewCount ?? 0, href: "/admin/trade-reviews" },
    { label: "Open job postings", count: openJobCount ?? 0, href: "/admin/jobs" },
    { label: "NFT collections", count: nftCollectionCount ?? 0, href: "/admin/nft" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="mw-card p-5 hover:border-[var(--accent-end)]/60">
            <p className="text-3xl font-bold">{card.count}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
