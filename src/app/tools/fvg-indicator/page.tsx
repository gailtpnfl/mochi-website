import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import type { TradingTool } from "@/lib/types";

export const metadata: Metadata = { title: "FVG Trading Indicator" };

export default async function FvgIndicatorPage() {
  const supabase = await createClient();
  const [{ data }, user] = await Promise.all([
    supabase.from("trading_tools").select("*").eq("slug", "fvg-indicator").maybeSingle(),
    getCurrentUser(),
  ]);

  const tool = data as TradingTool | null;
  const gated = (tool?.access ?? "members") !== "public";
  const unlocked = !gated || !!user;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/tools" className="text-sm text-muted hover:text-foreground">
        &larr; Trading Materials
      </Link>
      <h1 className="section-title mt-3">FVG Trading Indicator</h1>
      <p className="mt-3 text-muted">
        Fair Value Gap (FVG) marks the imbalance left behind by a strong impulsive move &mdash;
        a zone price often revisits before continuing. This indicator highlights those zones
        automatically on your TradingView chart.
      </p>

      <div className="mt-8 mw-card p-6">
        <h2 className="text-lg font-semibold">Install guide</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>Open TradingView and go to the Pine Editor.</li>
          <li>Paste the script from the download below.</li>
          <li>Click &quot;Add to chart&quot;, then adjust the lookback and fill settings to taste.</li>
        </ol>

        <div className="mt-6">
          {unlocked ? (
            tool?.asset_url ? (
              <a href={tool.asset_url} target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm">
                Download Pine Script
              </a>
            ) : (
              <p className="text-sm text-muted">
                Download link coming soon &mdash; the script is still being finalized.
              </p>
            )
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-white/5 p-4 text-sm text-muted">
              <Lock size={16} />
              <span>The Pine Script download is currently unavailable.</span>
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-muted">
        This is a charting tool, not a trading signal. It does not predict price and carries no
        performance guarantee.
      </p>
    </div>
  );
}
