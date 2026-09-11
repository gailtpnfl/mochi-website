"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import type { JournalEntry } from "@/lib/types";

/* ------------------------------------------------------------------ *
 * MOCHI WORLD — Trade Card
 * Palette and material pulled from the official MW mark: brushed chrome
 * on obsidian, chamfered edges echoing the shield. Wins read as polished
 * chrome, losses as oxidised copper.
 *
 * Ported from mochi-trade-card.jsx into the app. Rendered from the
 * Trading Journal ("Download card" on an entry), prefilled from that
 * entry via TradeCardModal.
 * ------------------------------------------------------------------ */

type Direction = "long" | "short";

export type CardData = {
  pair: string;
  direction: Direction;
  leverage: string;
  entry: string;
  exit: string;
  margin: string;
  setup: string;
  date: string;
  site: string;
};

type Pnl = { pct: number; usd: number; win: boolean };
type Stops = [number, string][];

const T = {
  obsidian: "#08090B",
  graphite: "#14161A",
  edge: "#22262D",
  steel: "#5A616D",
  chrome: "#E8ECF2",
  spec: "#FFFFFF",
  copper: "#C97A4A",
};

const GAIN_STOPS: Stops = [
  [0, "#FFFFFF"],
  [0.28, "#D6E4EE"],
  [0.5, "#8D96A3"],
  [0.62, "#F2F7FB"],
  [1, "#9AA4B1"],
];
const LOSS_STOPS: Stops = [
  [0, "#F6C9A6"],
  [0.28, "#D2884F"],
  [0.5, "#7E4324"],
  [0.62, "#F0B287"],
  [1, "#8A4E2C"],
];

const W = 1080;
const H = 1350;
const CHAMFER = 52;

const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function computePnl(t: CardData): Pnl {
  const e = parseFloat(t.entry) || 0;
  const x = parseFloat(t.exit) || 0;
  const lev = parseFloat(t.leverage) || 1;
  const m = parseFloat(t.margin) || 0;
  if (!e) return { pct: 0, usd: 0, win: true };
  const dir = t.direction === "long" ? 1 : -1;
  const pct = ((x - e) / e) * lev * dir * 100;
  return { pct, usd: (m * pct) / 100, win: pct >= 0 };
}

const cssGradient = (stops: Stops) =>
  `linear-gradient(176deg, ${stops.map(([p, c]) => `${c} ${p * 100}%`).join(", ")})`;

const chamferPath = (w: number, h: number, c: number) =>
  `polygon(${c}px 0, ${w}px 0, ${w}px ${h - c}px, ${w - c}px ${h}px, 0 ${h}px, 0 ${c}px)`;

const TAG_CLIP =
  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";

/* ---------------------------- preview card --------------------------- */

function Card({ t, pnl, logo }: { t: CardData; pnl: Pnl; logo: string }) {
  const win = pnl.win;
  const stops = win ? GAIN_STOPS : LOSS_STOPS;
  const sign = pnl.pct >= 0 ? "+" : "−";
  const pctStr = `${sign}${Math.abs(pnl.pct).toFixed(2)}%`;
  const pctSize = pctStr.length > 9 ? 132 : pctStr.length > 8 ? 148 : 166;

  const label: React.CSSProperties = {
    font: '500 24px "JetBrains Mono", ui-monospace, monospace',
    letterSpacing: "0.26em",
    color: T.steel,
    textTransform: "uppercase",
  };

  const metal = (s: Stops): React.CSSProperties => ({
    backgroundImage: cssGradient(s),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  });

  return (
    <div
      style={{
        width: W,
        height: H,
        background: `radial-gradient(120% 80% at 20% 0%, ${T.graphite} 0%, ${T.obsidian} 62%)`,
        clipPath: chamferPath(W, H, CHAMFER),
        position: "relative",
        overflow: "hidden",
        padding: 82,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        transformOrigin: "top left",
      }}
    >
      {/* shield watermark — the mark's own silhouette, oversized */}
      <svg
        aria-hidden
        viewBox="0 0 100 116"
        style={{ position: "absolute", right: -170, top: 320, width: 780, opacity: 0.055 }}
      >
        <path d="M50 2 97 30v58L50 114 3 88V30z" fill="none" stroke={T.chrome} strokeWidth="3" />
      </svg>

      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {logo ? (
            // Pixel-exact inside the scaled card; next/image would fight the layout.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" style={{ height: 74, width: "auto", display: "block" }} />
          ) : null}
          <span
            style={{
              font: '700 32px "JetBrains Mono", monospace',
              letterSpacing: "0.3em",
              ...metal(GAIN_STOPS),
            }}
          >
            MOCHI WEB3
          </span>
        </div>
        <span
          style={{
            font: '400 26px "JetBrains Mono", monospace',
            letterSpacing: "0.12em",
            color: T.steel,
          }}
        >
          {t.date}
        </span>
      </div>

      <div style={{ height: 1, background: T.edge, marginTop: 40, position: "relative" }} />

      {/* pair + tags */}
      <div style={{ marginTop: 60, position: "relative" }}>
        <div
          style={{
            font: '700 108px "Chakra Petch", system-ui, sans-serif',
            letterSpacing: "-0.015em",
            lineHeight: 1,
            ...metal(GAIN_STOPS),
          }}
        >
          {t.pair.toUpperCase()}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
          <span
            style={{
              font: '600 25px "JetBrains Mono", monospace',
              letterSpacing: "0.18em",
              padding: "13px 26px",
              clipPath: TAG_CLIP,
              background: t.direction === "long" ? T.chrome : T.copper,
              color: T.obsidian,
            }}
          >
            {t.direction === "long" ? "▲ LONG" : "▼ SHORT"}
          </span>
          <span
            style={{
              font: '600 25px "JetBrains Mono", monospace',
              letterSpacing: "0.18em",
              padding: "13px 26px",
              border: `1px solid ${T.steel}`,
              color: T.chrome,
              clipPath: TAG_CLIP,
            }}
          >
            {t.leverage || "1"}&#215;
          </span>
          {t.setup ? (
            <span
              style={{
                font: '400 25px "JetBrains Mono", monospace',
                letterSpacing: "0.12em",
                padding: "13px 26px",
                border: `1px solid ${T.edge}`,
                color: T.steel,
                clipPath: TAG_CLIP,
              }}
            >
              {t.setup.toUpperCase()}
            </span>
          ) : null}
        </div>
      </div>

      {/* hero — the number, cast in the logo's own metal */}
      <div style={{ marginTop: 72, position: "relative" }}>
        <div style={label}>{win ? "Realised profit" : "Realised loss"}</div>
        <div
          style={{
            font: `700 ${pctSize}px "Chakra Petch", system-ui, sans-serif`,
            letterSpacing: "-0.02em",
            lineHeight: 1.04,
            marginTop: 14,
            fontVariantNumeric: "tabular-nums",
            filter: "drop-shadow(0 3px 0 rgba(0,0,0,0.85))",
            ...metal(stops),
          }}
        >
          {pctStr}
        </div>
        <div
          style={{
            font: '700 48px "JetBrains Mono", monospace',
            color: win ? T.chrome : T.copper,
            marginTop: 10,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {sign}${fmtMoney(Math.abs(pnl.usd))}
        </div>
      </div>

      {/* stats */}
      <div style={{ display: "flex", gap: 14, marginTop: "auto", position: "relative" }}>
        {(
          [
            ["Entry", `$${fmtMoney(parseFloat(t.entry) || 0)}`],
            ["Exit", `$${fmtMoney(parseFloat(t.exit) || 0)}`],
            ["Margin", `$${fmtMoney(parseFloat(t.margin) || 0)}`],
          ] as [string, string][]
        ).map(([k, v]) => (
          <div
            key={k}
            style={{
              flex: 1,
              border: `1px solid ${T.edge}`,
              background: "rgba(255,255,255,0.02)",
              padding: "26px 28px",
              clipPath:
                "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
            }}
          >
            <div style={{ ...label, fontSize: 21, letterSpacing: "0.2em" }}>{k}</div>
            <div
              style={{
                font: '700 40px "JetBrains Mono", monospace',
                color: T.chrome,
                marginTop: 12,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>

      {/* footer */}
      <div style={{ marginTop: 44, position: "relative" }}>
        <div style={{ height: 1, background: T.edge, marginBottom: 26 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span
            style={{
              font: '400 22px "JetBrains Mono", monospace',
              color: T.steel,
              letterSpacing: "0.1em",
            }}
          >
            JOURNAL ENTRY &#183; NOT FINANCIAL ADVICE
          </span>
          <span
            style={{
              font: '700 24px "JetBrains Mono", monospace',
              color: T.chrome,
              letterSpacing: "0.14em",
            }}
          >
            {t.site}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- canvas export -------------------------- */

function chamferRect(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  c: number,
) {
  g.beginPath();
  g.moveTo(x + c, y);
  g.lineTo(x + w, y);
  g.lineTo(x + w, y + h - c);
  g.lineTo(x + w - c, y + h);
  g.lineTo(x, y + h);
  g.lineTo(x, y + c);
  g.closePath();
}

function metalFill(
  g: CanvasRenderingContext2D,
  baselineY: number,
  size: number,
  stops: Stops,
): CanvasGradient {
  const grad = g.createLinearGradient(0, baselineY - size, 0, baselineY + size * 0.22);
  stops.forEach(([p, c]) => grad.addColorStop(p, c));
  return grad;
}

function tag(
  g: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  bg: string | null,
  fg: string,
  border: string | null,
): number {
  g.font = font;
  const w = g.measureText(text).width + 52;
  const h = 58;
  chamferRect(g, x, y, w, h, 12);
  if (bg) {
    g.fillStyle = bg;
    g.fill();
  }
  if (border) {
    g.strokeStyle = border;
    g.lineWidth = 1.5;
    g.stroke();
  }
  g.fillStyle = fg;
  g.textBaseline = "middle";
  g.fillText(text, x + 26, y + h / 2 + 1);
  g.textBaseline = "alphabetic";
  return w;
}

async function exportPng(t: CardData, pnl: Pnl, logo: string): Promise<void> {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  if (!g) return;
  const win = pnl.win;
  const stops = win ? GAIN_STOPS : LOSS_STOPS;

  await Promise.all([
    document.fonts.load('700 108px "Chakra Petch"'),
    document.fonts.load('700 32px "JetBrains Mono"'),
    document.fonts.load('400 26px "JetBrains Mono"'),
  ]).catch(() => {});

  chamferRect(g, 0, 0, W, H, CHAMFER);
  g.save();
  g.clip();

  const bg = g.createRadialGradient(W * 0.2, 0, 0, W * 0.2, 0, W * 1.1);
  bg.addColorStop(0, T.graphite);
  bg.addColorStop(0.62, T.obsidian);
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);

  // shield watermark
  g.save();
  g.globalAlpha = 0.055;
  g.strokeStyle = T.chrome;
  g.lineWidth = 22;
  const cx = 1000;
  const cy = 720;
  const R = 380;
  g.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    const px = cx + R * Math.cos(a) * 0.86;
    const py = cy + R * Math.sin(a);
    if (i) g.lineTo(px, py);
    else g.moveTo(px, py);
  }
  g.closePath();
  g.stroke();
  g.restore();

  const P = 82;

  // header
  let wordX = P;
  if (logo) {
    try {
      const img = new Image();
      img.src = logo;
      await img.decode();
      const lh = 74;
      const lw = (img.width / img.height) * lh;
      g.drawImage(img, P, 42, lw, lh);
      wordX = P + lw + 22;
    } catch {
      /* logo optional */
    }
  }
  g.font = '700 32px "JetBrains Mono", monospace';
  g.fillStyle = metalFill(g, 92, 34, GAIN_STOPS);
  g.fillText("M O C H I   W E B 3", wordX, 92);

  g.font = '400 26px "JetBrains Mono", monospace';
  g.fillStyle = T.steel;
  g.textAlign = "right";
  g.fillText(t.date, W - P, 92);
  g.textAlign = "left";

  g.fillStyle = T.edge;
  g.fillRect(P, 154, W - P * 2, 1);

  // pair
  g.font = '700 108px "Chakra Petch", sans-serif';
  g.fillStyle = metalFill(g, 300, 108, GAIN_STOPS);
  g.fillText(t.pair.toUpperCase(), P, 300);

  // tags
  let tx = P;
  const tf = '600 25px "JetBrains Mono", monospace';
  tx +=
    tag(
      g,
      t.direction === "long" ? "▲ LONG" : "▼ SHORT",
      tx,
      336,
      tf,
      t.direction === "long" ? T.chrome : T.copper,
      T.obsidian,
      null,
    ) + 14;
  tx += tag(g, `${t.leverage || "1"}×`, tx, 336, tf, null, T.chrome, T.steel) + 14;
  if (t.setup)
    tag(g, t.setup.toUpperCase(), tx, 336, '400 25px "JetBrains Mono", monospace', null, T.steel, T.edge);

  // hero
  g.font = '500 24px "JetBrains Mono", monospace';
  g.fillStyle = T.steel;
  g.fillText(win ? "R E A L I S E D   P R O F I T" : "R E A L I S E D   L O S S", P, 508);

  const sign = pnl.pct >= 0 ? "+" : "−";
  const pctStr = `${sign}${Math.abs(pnl.pct).toFixed(2)}%`;
  let size = 166;
  do {
    g.font = `700 ${size}px "Chakra Petch", sans-serif`;
    size -= 6;
  } while (g.measureText(pctStr).width > W - P * 2 && size > 92);

  g.fillStyle = "rgba(0,0,0,0.85)";
  g.fillText(pctStr, P, 653);
  g.fillStyle = metalFill(g, 650, size, stops);
  g.fillText(pctStr, P, 650);

  g.font = '700 48px "JetBrains Mono", monospace';
  g.fillStyle = win ? T.chrome : T.copper;
  g.fillText(`${sign}$${fmtMoney(Math.abs(pnl.usd))}`, P, 724);

  // stats
  const stats: [string, string][] = [
    ["E N T R Y", `$${fmtMoney(parseFloat(t.entry) || 0)}`],
    ["E X I T", `$${fmtMoney(parseFloat(t.exit) || 0)}`],
    ["M A R G I N", `$${fmtMoney(parseFloat(t.margin) || 0)}`],
  ];
  const gap = 14;
  const colW = (W - P * 2 - gap * 2) / 3;
  stats.forEach(([k, v], i) => {
    const x = P + (colW + gap) * i;
    chamferRect(g, x, 1000, colW, 128, 16);
    g.fillStyle = "rgba(255,255,255,0.02)";
    g.fill();
    g.strokeStyle = T.edge;
    g.lineWidth = 1.5;
    g.stroke();
    g.font = '500 21px "JetBrains Mono", monospace';
    g.fillStyle = T.steel;
    g.fillText(k, x + 28, 1042);
    g.font = '700 40px "JetBrains Mono", monospace';
    g.fillStyle = T.chrome;
    g.fillText(v, x + 28, 1098);
  });

  // footer
  g.fillStyle = T.edge;
  g.fillRect(P, H - 130, W - P * 2, 1);
  g.font = '400 22px "JetBrains Mono", monospace';
  g.fillStyle = T.steel;
  g.fillText("JOURNAL ENTRY · NOT FINANCIAL ADVICE", P, H - 82);
  g.font = '700 24px "JetBrains Mono", monospace';
  g.fillStyle = T.chrome;
  g.textAlign = "right";
  g.fillText(t.site, W - P, H - 82);
  g.restore();

  const a = document.createElement("a");
  a.download = `mochi-${t.pair.replace(/\W/g, "")}-${t.date.replace(/\W/g, "")}.png`;
  a.href = c.toDataURL("image/png");
  a.click();
}

/* ------------------------------- studio ------------------------------ */

// The card's site line is derived from the real website URL (NEXT_PUBLIC_SITE_URL),
// shown as a bare host, and is not user-editable. SSR-safe: no window access.
const SITE_HOST: string = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    return new URL(raw).host.replace(/^www\./, "");
  } catch {
    return raw.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
  }
})();

const DEFAULTS: CardData = {
  pair: "XAU/USDT",
  direction: "long",
  leverage: "50",
  entry: "4011.60",
  exit: "4157.30",
  margin: "1000",
  setup: "FVG retest",
  date: "22 JUL 2026",
  site: SITE_HOST,
};

export function TradeCardStudio({
  initial,
  logoSrc = MW_LOGO,
}: {
  initial?: Partial<CardData>;
  /** Same-origin path so the canvas export stays untainted. */
  logoSrc?: string;
}) {
  // site is always the real website host — never taken from initial, never edited.
  const [t, setT] = useState<CardData>({ ...DEFAULTS, ...initial, site: SITE_HOST });

  const pnl = computePnl(t);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.32);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const set = useCallback(
    (k: keyof CardData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setT((p) => ({ ...p, [k]: e.target.value }) as CardData),
    [],
  );

  const field: React.CSSProperties = {
    width: "100%",
    background: T.obsidian,
    border: `1px solid ${T.edge}`,
    borderRadius: 0,
    padding: "12px 14px",
    font: '400 15px "JetBrains Mono", monospace',
    color: T.chrome,
    outline: "none",
    boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    display: "block",
    font: '500 11px "JetBrains Mono", monospace',
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: T.steel,
    marginBottom: 8,
  };

  return (
    <div style={{ minHeight: "100%", background: "#050507", padding: "30px 20px 52px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        input:focus, select:focus { border-color: ${T.chrome} !important; }
        button:focus-visible { outline: 2px solid ${T.chrome}; outline-offset: 3px; }
        select option { background: ${T.obsidian}; color: ${T.chrome}; }
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h1
          style={{
            font: '700 28px "Chakra Petch", sans-serif',
            letterSpacing: "0.04em",
            backgroundImage: cssGradient(GAIN_STOPS),
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            margin: "0 0 6px",
          }}
        >
          TRADE CARD
        </h1>
        <p style={{ font: '400 13px "JetBrains Mono", monospace', color: T.steel, margin: "0 0 30px" }}>
          Export a closed journal entry as a shareable card.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 34, alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 300px", minWidth: 280, display: "grid", gap: 16 }}>
            <div>
              <label style={lbl} htmlFor="tc-pair">Pair</label>
              <input id="tc-pair" style={field} value={t.pair} onChange={set("pair")} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={lbl} htmlFor="tc-dir">Direction</label>
                <select id="tc-dir" style={field} value={t.direction} onChange={set("direction")}>
                  <option value="long">Long</option>
                  <option value="short">Short</option>
                </select>
              </div>
              <div>
                <label style={lbl} htmlFor="tc-lev">Leverage</label>
                <input id="tc-lev" style={field} inputMode="decimal" value={t.leverage} onChange={set("leverage")} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={lbl} htmlFor="tc-entry">Entry</label>
                <input id="tc-entry" style={field} inputMode="decimal" value={t.entry} onChange={set("entry")} />
              </div>
              <div>
                <label style={lbl} htmlFor="tc-exit">Exit</label>
                <input id="tc-exit" style={field} inputMode="decimal" value={t.exit} onChange={set("exit")} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={lbl} htmlFor="tc-margin">Margin</label>
                <input id="tc-margin" style={field} inputMode="decimal" value={t.margin} onChange={set("margin")} />
              </div>
              <div>
                <label style={lbl} htmlFor="tc-setup">Setup tag</label>
                <input id="tc-setup" style={field} value={t.setup} onChange={set("setup")} placeholder="optional" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={lbl} htmlFor="tc-date">Date</label>
                <input id="tc-date" style={field} value={t.date} onChange={set("date")} />
              </div>
              <div>
                <span style={lbl}>Site</span>
                <div
                  style={{ ...field, color: T.steel, display: "flex", alignItems: "center", userSelect: "none" }}
                  title="Set automatically from the website URL"
                >
                  {t.site}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void exportPng(t, pnl, logoSrc)}
              style={{
                marginTop: 8,
                padding: "17px 22px",
                border: `1px solid ${T.steel}`,
                background: T.chrome,
                color: T.obsidian,
                font: '700 13px "JetBrains Mono", monospace',
                letterSpacing: "0.2em",
                cursor: "pointer",
                clipPath:
                  "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
              }}
            >
              DOWNLOAD PNG · 1080×1350
            </button>
          </div>

          <div style={{ flex: "1 1 340px", minWidth: 280 }}>
            <div ref={wrapRef} style={{ width: "100%", position: "relative", paddingTop: `${(H / W) * 100}%` }}>
              <div style={{ position: "absolute", inset: 0 }}>
                <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
                  <Card t={t} pnl={pnl} logo={logoSrc} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------- journal → card --------------------------- */

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

function fmtCardDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
}

function entryToCardData(entry: JournalEntry): Partial<CardData> {
  return {
    pair: entry.symbol,
    direction: entry.direction === "short" ? "short" : "long",
    leverage: entry.leverage != null ? String(entry.leverage) : "",
    entry: entry.entry_price != null ? String(entry.entry_price) : "",
    exit: entry.exit_price != null ? String(entry.exit_price) : "",
    margin: entry.margin != null ? String(entry.margin) : "",
    setup: "",
    date: fmtCardDate(entry.traded_at),
    // site is forced to the real website host in the studio, not taken from here.
  };
}

export function TradeCardModal({
  entry,
  onClose,
}: {
  entry: JournalEntry;
  onClose: () => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Trade card"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-6 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg text-white/80 hover:bg-black/80 hover:text-white"
        >
          ✕
        </button>
        <TradeCardStudio initial={entryToCardData(entry)} />
      </div>
    </div>
  );
}

/* The MW chrome-shield mark, decoded from the original card source into
   public/images/. Same-origin, so toDataURL() on export stays untainted.
   Pass logoSrc to override. */
const MW_LOGO = "/images/mochi-mark.png";

