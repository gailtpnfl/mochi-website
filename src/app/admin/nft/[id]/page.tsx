import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NftCollectionForm } from "@/components/admin/nft-collection-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteNftItem } from "@/lib/actions/admin";
import type { NftCollection, NftItem } from "@/lib/types";

type Params = Promise<{ id: string }>;

export default async function AdminNftCollectionDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: collection }, { data: itemsData }] = await Promise.all([
    supabase.from("nft_collections").select("*").eq("id", id).maybeSingle(),
    supabase.from("nft_items").select("*").eq("collection_id", id).order("position"),
  ]);

  if (!collection) notFound();
  const items = (itemsData ?? []) as NftItem[];

  return (
    <div>
      <Link href="/admin/nft" className="text-sm text-muted hover:text-foreground">
        &larr; NFT Collections
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{(collection as NftCollection).name}</h1>

      <div className="mt-6">
        <NftCollectionForm collection={collection as NftCollection} />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Gallery items</h2>
        <Link
          href={`/admin/nft/${id}/items/new`}
          className="rounded-full border border-border px-4 py-2 text-sm hover:bg-white/5"
        >
          New item
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="mw-card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.name ?? ""} className="aspect-square w-full object-cover" />
            <div className="flex items-center justify-between gap-2 p-2">
              <p className="truncate text-xs">{item.name ?? "Untitled"}</p>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/nft/${id}/items/${item.id}/edit`}
                  className="text-xs text-muted hover:text-foreground"
                >
                  Edit
                </Link>
                <DeleteButton action={deleteNftItem.bind(null, id, item.id)} confirmMessage="Delete this item?" />
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted">No items yet.</p>}
      </div>
    </div>
  );
}
