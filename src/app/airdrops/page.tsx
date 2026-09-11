import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AirdropCard } from "@/components/airdrop-card";
import type { Airdrop, AirdropStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Airdrop Hunting",
  description: "A curated directory of Web3 airdrops with step-by-step guides.",
};

const STATUS_ORDER: AirdropStatus[] = ["live", "upcoming", "ended"];

export default async function AirdropsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("airdrops")
    .select("*")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  const airdrops = (data ?? []) as Airdrop[];
  const featured = airdrops.filter((a) => a.is_featured);
  const byStatus = STATUS_ORDER.map((status) => ({
    status,
    items: airdrops.filter((a) => a.status === status),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <span className="section-eyebrow">06 &middot; Opportunities</span>
      <h1 className="section-title">Airdrop Hunting</h1>
      <p className="section-sub">
        Curated, guide-backed airdrop opportunities. Educational content only &mdash; always
        verify links yourself before connecting a wallet.
      </p>

      {featured.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold">Featured</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((a) => (
              <AirdropCard key={a.id} airdrop={a} />
            ))}
          </div>
        </section>
      )}

      {byStatus.map((group) => (
        <section key={group.status} className="mt-10">
          <h2 className="mb-4 text-lg font-bold capitalize">{group.status}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((a) => (
              <AirdropCard key={a.id} airdrop={a} />
            ))}
          </div>
        </section>
      ))}

      {airdrops.length === 0 && (
        <p className="mt-10 text-sm text-muted">No airdrops listed yet &mdash; check back soon.</p>
      )}
    </div>
  );
}
