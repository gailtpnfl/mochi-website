import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Markdown } from "@/components/markdown";
import type { Airdrop } from "@/lib/types";

type Params = Promise<{ slug: string }>;

async function getAirdrop(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("airdrops")
    .select("*, partner:partners(*)")
    .eq("slug", slug)
    .eq("is_archived", false)
    .maybeSingle();

  return data as Airdrop | null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const airdrop = await getAirdrop(slug);
  if (!airdrop) return { title: "Airdrop not found" };

  return {
    title: airdrop.title,
    description: airdrop.summary ?? undefined,
  };
}

export default async function AirdropDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const airdrop = await getAirdrop(slug);

  if (!airdrop) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/airdrops" className="text-sm text-muted hover:text-foreground">
        &larr; Back to Airdrop Hunting
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {airdrop.chain && <span className="chip chip-muted">{airdrop.chain}</span>}
        <span className="chip capitalize">{airdrop.status}</span>
      </div>

      <h1 className="section-title mt-3">{airdrop.title}</h1>
      {airdrop.summary && <p className="mt-3 text-muted">{airdrop.summary}</p>}

      {airdrop.external_url && (
        <a href={airdrop.external_url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">
          Visit official site
        </a>
      )}

      {airdrop.guide_md && (
        <div className="mt-10">
          <Markdown>{airdrop.guide_md}</Markdown>
        </div>
      )}

      {airdrop.partner && (
        <div className="mt-10 border-t border-border pt-6 text-sm text-muted">
          Listed in partnership with{" "}
          {airdrop.partner.website_url ? (
            <a
              href={airdrop.partner.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              {airdrop.partner.name}
            </a>
          ) : (
            <span className="text-foreground">{airdrop.partner.name}</span>
          )}
          .
        </div>
      )}

      <p className="mt-10 rounded-xl border border-border bg-white/5 p-4 text-xs text-muted">
        Educational content only, not financial advice. Always verify links yourself and never
        share your seed phrase.
      </p>
    </div>
  );
}
