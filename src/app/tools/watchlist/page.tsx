import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Markdown } from "@/components/markdown";
import type { WatchlistItem } from "@/lib/types";

export const metadata: Metadata = { title: "Watchlist by BigDaddyDaks" };

const STATUS_STYLES: Record<WatchlistItem["status"], string> = {
  watching: "chip-muted",
  active: "chip-live",
  closed: "chip",
};

export default async function WatchlistPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("watchlist_items")
    .select("*")
    .order("added_at", { ascending: false });

  const items = (data ?? []) as WatchlistItem[];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/tools" className="text-sm text-muted hover:text-foreground">
        &larr; Trading Materials
      </Link>
      <h1 className="section-title mt-3">Watchlist by BigDaddyDaks</h1>
      <p className="mt-3 text-muted">
        Symbols BigDaddyDaks is studying, with the reasoning behind each one.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="mw-card mw-card-lift p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold">{item.symbol}</span>
                {item.exchange && <span className="text-xs text-muted">{item.exchange}</span>}
              </div>
              <span className={`chip capitalize ${STATUS_STYLES[item.status]}`}>{item.status}</span>
            </div>
            {item.thesis_md && (
              <div className="mt-3">
                <Markdown>{item.thesis_md}</Markdown>
              </div>
            )}
            <p className="mt-3 border-t border-border pt-3 text-xs text-muted">
              This is analysis and education, not a trade call. Always do your own research.
            </p>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted">Nothing on the watchlist yet.</p>}
      </div>
    </div>
  );
}
