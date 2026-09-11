import Link from "next/link";
import type { Airdrop } from "@/lib/types";

const STATUS_STYLES: Record<Airdrop["status"], string> = {
  upcoming: "chip-new",
  live: "chip-live",
  ended: "chip",
};

export function AirdropCard({ airdrop }: { airdrop: Airdrop }) {
  return (
    <Link
      href={`/airdrops/${airdrop.slug}`}
      className="mw-card mw-card-lift group flex flex-col gap-3 p-5"
    >
      <div className="flex items-center justify-between gap-2">
        {airdrop.chain && <span className="chip chip-muted">{airdrop.chain}</span>}
        <span className={`chip capitalize ${STATUS_STYLES[airdrop.status]}`}>{airdrop.status}</span>
      </div>
      <h3 className="text-lg font-bold group-hover:text-[var(--accent)]">{airdrop.title}</h3>
      {airdrop.summary && <p className="line-clamp-2 text-sm text-muted">{airdrop.summary}</p>}
    </Link>
  );
}
