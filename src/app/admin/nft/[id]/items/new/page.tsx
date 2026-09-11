import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NftItemForm } from "@/components/admin/nft-item-form";

type Params = Promise<{ id: string }>;

export default async function NewNftItemPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: collection } = await supabase.from("nft_collections").select("id").eq("id", id).maybeSingle();
  if (!collection) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">New gallery item</h1>
      <div className="mt-6">
        <NftItemForm collectionId={id} />
      </div>
    </div>
  );
}
