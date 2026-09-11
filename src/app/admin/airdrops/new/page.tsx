import { createClient } from "@/lib/supabase/server";
import { AirdropForm } from "@/components/admin/airdrop-form";
import type { Partner } from "@/lib/types";

export default async function NewAirdropPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("partners").select("*").order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold">New airdrop</h1>
      <div className="mt-6">
        <AirdropForm partners={(data ?? []) as Partner[]} />
      </div>
    </div>
  );
}
