import type { Metadata } from "next";
import { TradingViewWidget } from "@/components/tradingview-widget";

export const metadata: Metadata = { title: "TradingView" };

export default function TradingViewPage() {
  const scriptsUrl = process.env.NEXT_PUBLIC_TRADINGVIEW_PROFILE_URL || "https://www.tradingview.com/";

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="section-title">TradingView</h1>
      <p className="section-sub">
        A free-tier embedded chart, plus links to Mochi&apos;s published TradingView scripts.
        For education only &mdash; not a recommendation to trade any symbol shown.
      </p>

      <div className="mt-8">
        <TradingViewWidget />
      </div>

      <a href={scriptsUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-8">
        View Mochi&apos;s TradingView scripts &rarr;
      </a>
    </div>
  );
}
