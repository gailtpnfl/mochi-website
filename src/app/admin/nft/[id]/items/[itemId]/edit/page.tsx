import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NftItemForm } from "@/components/admin/nft-item-form";
import type { NftItem } from "@/lib/types";

type Params = Promise<{ id: string; itemId: string }>;

export default async function EditNftItemPage({ params }: { params: Params }) {
  const { id, itemId } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("nft_items")
    .select("*")
    .eq("id", itemId)
    .eq("collection_id", id)
    .maybeSingle();

  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit gallery item</h1>
      <div className="mt-6">
        <NftItemForm collectionId={id} item={item as NftItem} />
      </div>
    </div>
  );
}
