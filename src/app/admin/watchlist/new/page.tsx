import { WatchlistForm } from "@/components/admin/watchlist-form";

export default function NewWatchlistItemPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New watchlist item</h1>
      <div className="mt-6">
        <WatchlistForm />
      </div>
    </div>
  );
}
