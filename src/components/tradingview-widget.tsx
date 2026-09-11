"use client";

import { useState } from "react";

export function TradingViewWidget() {
  const [symbol, setSymbol] = useState("BINANCE:BTCUSDT");
  const [input, setInput] = useState(symbol);

  const src = `https://www.tradingview.com/widgetembed/?symbol=${encodeURIComponent(
    symbol,
  )}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=0&toolbarbg=131420&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC`;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) setSymbol(input.trim().toUpperCase());
        }}
        className="mb-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. BINANCE:ETHUSDT"
          className="input max-w-xs"
        />
        <button
          type="submit"
          className="rounded-full border border-border px-4 py-2 text-sm hover:bg-white/5"
        >
          Load
        </button>
      </form>
      <div className="aspect-video overflow-hidden rounded-xl border border-border">
        <iframe key={symbol} src={src} className="h-full w-full" title="TradingView chart" />
      </div>
    </div>
  );
}
