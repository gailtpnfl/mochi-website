import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WatchlistForm } from "@/components/admin/watchlist-form";
import type { WatchlistItem } from "@/lib/types";

type Params = Promise<{ id: string }>;

export default async function EditWatchlistItemPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase.from("watchlist_items").select("*").eq("id", id).maybeSingle();

  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit watchlist item</h1>
      <div className="mt-6">
        <WatchlistForm item={item as WatchlistItem} />
      </div>
    </div>
  );
}
