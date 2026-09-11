import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { NftCollection } from "@/lib/types";

export const metadata: Metadata = {
  title: "NFT Community Collections",
  description: "Display-only community art galleries. No minting, no wallet connect.",
};

export default async function NftCollectionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("nft_collections")
    .select("*")
    .eq("is_published", true)
    .order("position");

  const collections = (data ?? []) as NftCollection[];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <span className="section-eyebrow">09 &middot; NFTs</span>
      <h1 className="section-title">NFT Community Collections</h1>
      <p className="section-sub">
        Community showcase galleries. Display-only &mdash; no minting, no wallet connect, and
        nothing here is investment advice.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {collections.map((c) => (
          <Link key={c.id} href={`/nft/${c.slug}`} className="mw-card mw-card-lift group overflow-hidden">
            {c.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.cover_image_url}
                alt={c.name}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold group-hover:text-[var(--accent)]">{c.name}</h2>
                {c.chain && <span className="chip chip-muted">{c.chain}</span>}
              </div>
              {c.artist && <p className="mt-1 text-xs text-muted">by {c.artist}</p>}
            </div>
          </Link>
        ))}
        {collections.length === 0 && (
          <p className="text-sm text-muted">No collections published yet &mdash; check back soon.</p>
        )}
      </div>
    </div>
  );
}
