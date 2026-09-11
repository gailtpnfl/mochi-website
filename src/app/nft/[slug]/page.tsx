import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Markdown } from "@/components/markdown";
import type { NftCollection, NftItem } from "@/lib/types";

type Params = Promise<{ slug: string }>;

async function getCollection(slug: string) {
  const supabase = await createClient();
  const { data: collection } = await supabase
    .from("nft_collections")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!collection) return null;

  const { data: items } = await supabase
    .from("nft_items")
    .select("*")
    .eq("collection_id", collection.id)
    .order("position");

  return { collection: collection as NftCollection, items: (items ?? []) as NftItem[] };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCollection(slug);
  if (!data) return { title: "Collection not found" };
  return { title: data.collection.name, description: data.collection.description_md ?? undefined };
}

export default async function NftCollectionDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await getCollection(slug);
  if (!data) notFound();

  const { collection, items } = data;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/nft" className="text-sm text-muted hover:text-foreground">
        &larr; NFT Community Collections
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {collection.chain && <span className="chip chip-muted">{collection.chain}</span>}
        {collection.artist && (
          <span className="text-xs text-muted">by {collection.artist}</span>
        )}
      </div>

      <h1 className="section-title mt-2">{collection.name}</h1>

      {collection.description_md && (
        <div className="mt-4 max-w-2xl">
          <Markdown>{collection.description_md}</Markdown>
        </div>
      )}

      {collection.marketplace_url && (
        <a href={collection.marketplace_url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">
          View on marketplace
        </a>
      )}

      {items.length > 0 && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="mw-card mw-card-lift overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt={item.name ?? collection.name} className="aspect-square w-full object-cover" />
              {item.name && <p className="p-2 text-center text-xs text-muted">{item.name}</p>}
            </div>
          ))}
        </div>
      )}

      <p className="mt-10 rounded-xl border border-border bg-white/5 p-4 text-xs text-muted">
        Community showcase only &mdash; not an investment, not a promise of value, and not
        affiliated with any token launch. No wallet connection or minting happens on this site.
      </p>
    </div>
  );
}
