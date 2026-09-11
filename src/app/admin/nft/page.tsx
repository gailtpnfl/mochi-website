import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteNftCollection } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import type { NftCollection } from "@/lib/types";

export default async function AdminNftCollectionsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("nft_collections").select("*").order("position");

  const collections = (data ?? []) as NftCollection[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">NFT Collections</h1>
        <Link
          href="/admin/nft/new"
          className="rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-4 py-2 text-sm font-medium text-white"
        >
          New collection
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {collections.map((c) => (
          <div key={c.id} className="mw-card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {c.name} {!c.is_published && <span className="text-xs text-muted">(draft)</span>}
              </p>
              <p className="text-xs text-muted">/{c.slug}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link href={`/admin/nft/${c.id}`} className="text-xs text-muted hover:text-foreground">
                Manage items
              </Link>
              <DeleteButton
                action={deleteNftCollection.bind(null, c.id)}
                confirmMessage={`Delete "${c.name}" and all its items?`}
              />
            </div>
          </div>
        ))}
        {collections.length === 0 && <p className="text-sm text-muted">No collections yet.</p>}
      </div>
    </div>
  );
}
