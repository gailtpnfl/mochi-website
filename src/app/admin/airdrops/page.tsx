import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteAirdrop } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import type { Airdrop } from "@/lib/types";

export default async function AdminAirdropsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("airdrops")
    .select("*")
    .order("created_at", { ascending: false });

  const airdrops = (data ?? []) as Airdrop[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Airdrops</h1>
        <Link
          href="/admin/airdrops/new"
          className="rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-4 py-2 text-sm font-medium text-white"
        >
          New airdrop
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {airdrops.map((a) => (
          <div key={a.id} className="mw-card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {a.title}{" "}
                {a.is_archived && <span className="text-xs text-muted">(archived)</span>}
              </p>
              <p className="text-xs text-muted">
                /{a.slug} &middot; {a.status} {a.is_featured && "· featured"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link
                href={`/admin/airdrops/${a.id}/edit`}
                className="text-xs text-muted hover:text-foreground"
              >
                Edit
              </Link>
              <DeleteButton action={deleteAirdrop.bind(null, a.id)} confirmMessage={`Delete "${a.title}"?`} />
            </div>
          </div>
        ))}
        {airdrops.length === 0 && <p className="text-sm text-muted">No airdrops yet.</p>}
      </div>
    </div>
  );
}
