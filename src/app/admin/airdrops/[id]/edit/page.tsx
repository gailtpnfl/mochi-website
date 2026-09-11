import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AirdropForm } from "@/components/admin/airdrop-form";
import type { Airdrop, Partner } from "@/lib/types";

type Params = Promise<{ id: string }>;

export default async function EditAirdropPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: airdrop }, { data: partners }] = await Promise.all([
    supabase.from("airdrops").select("*").eq("id", id).maybeSingle(),
    supabase.from("partners").select("*").order("name"),
  ]);

  if (!airdrop) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit airdrop</h1>
      <div className="mt-6">
        <AirdropForm airdrop={airdrop as Airdrop} partners={(partners ?? []) as Partner[]} />
      </div>
    </div>
  );
}
