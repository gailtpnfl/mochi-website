import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteWatchlistItem } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import type { WatchlistItem } from "@/lib/types";

export default async function AdminWatchlistPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("watchlist_items").select("*").order("added_at", { ascending: false });

  const items = (data ?? []) as WatchlistItem[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Watchlist</h1>
        <Link
          href="/admin/watchlist/new"
          className="rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-4 py-2 text-sm font-medium text-white"
        >
          New item
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="mw-card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {item.symbol} {item.exchange && <span className="text-xs text-muted">({item.exchange})</span>}
              </p>
              <p className="text-xs text-muted capitalize">{item.status}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link href={`/admin/watchlist/${item.id}/edit`} className="text-xs text-muted hover:text-foreground">
                Edit
              </Link>
              <DeleteButton action={deleteWatchlistItem.bind(null, item.id)} confirmMessage={`Delete ${item.symbol}?`} />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted">Nothing on the watchlist yet.</p>}
      </div>
    </div>
  );
}
