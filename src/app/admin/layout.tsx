import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/airdrops", label: "Airdrops" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/watchlist", label: "Watchlist" },
  { href: "/admin/cohorts", label: "Cohorts" },
  { href: "/admin/trade-reviews", label: "Trade Reviews" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/nft", label: "NFT Collections" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) notFound();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row">
      <aside className="lg:w-48 lg:shrink-0">
        <p className="mb-3 text-xs uppercase tracking-wide text-muted">Admin</p>
        <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
