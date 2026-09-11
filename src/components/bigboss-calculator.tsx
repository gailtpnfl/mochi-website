"use client";

import { useMemo, useState } from "react";

export function BigBossCalculator() {
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [accountSize, setAccountSize] = useState("1000");
  const [riskPct, setRiskPct] = useState("1");
  const [entry, setEntry] = useState("");
  const [stop, setStop] = useState("");
  const [target, setTarget] = useState("");

  const result = useMemo(() => {
    const acct = parseFloat(accountSize);
    const risk = parseFloat(riskPct);
    const e = parseFloat(entry);
    const s = parseFloat(stop);
    const t = parseFloat(target);

    if (!acct || !risk || !e || !s || acct <= 0 || risk <= 0) return null;

    const perUnitRisk = direction === "long" ? e - s : s - e;
    if (perUnitRisk <= 0) return { error: "Stop must be on the losing side of entry for this direction." };

    const riskAmount = acct * (risk / 100);
    const positionSize = riskAmount / perUnitRisk;
    const positionValue = positionSize * e;

    let rMultiple: number | null = null;
    if (t && !Number.isNaN(t)) {
      const reward = direction === "long" ? t - e : e - t;
      rMultiple = reward / perUnitRisk;
    }

    return { riskAmount, positionSize, positionValue, rMultiple };
  }, [accountSize, riskPct, entry, stop, target, direction]);

  return (
    <div className="mw-card p-6">
      <div className="mb-5 flex gap-2">
        {(["long", "short"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDirection(d)}
            className={`flex-1 rounded-full border px-4 py-2 text-sm font-medium capitalize transition ${
              direction === d
                ? "border-transparent bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-white"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Account size ($)">
          <input
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Risk (%)">
          <input
            type="number"
            step="0.1"
            value={riskPct}
            onChange={(e) => setRiskPct(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Entry price">
          <input
            type="number"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Stop price">
          <input
            type="number"
            value={stop}
            onChange={(e) => setStop(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Target price (optional, for R:R)">
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-white/5 p-5">
        {!result && <p className="text-sm text-muted">Enter account size, risk %, entry, and stop.</p>}
        {result && "error" in result && <p className="text-sm text-red-400">{result.error}</p>}
        {result && !("error" in result) && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Risk amount" value={`$${result.riskAmount.toFixed(2)}`} />
            <Stat label="Position size" value={result.positionSize.toFixed(4)} />
            <Stat label="Position value" value={`$${result.positionValue.toFixed(2)}`} />
            {result.rMultiple !== null && (
              <Stat label="Risk:Reward" value={`1 : ${result.rMultiple.toFixed(2)}`} />
            )}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-muted">
        Nothing you enter here is sent to a server or stored. Educational tool, not financial
        advice.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
