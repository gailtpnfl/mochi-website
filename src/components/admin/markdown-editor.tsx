"use client";

import { useState } from "react";
import { Markdown } from "@/components/markdown";

export function MarkdownEditor({
  name,
  defaultValue,
  rows = 10,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="rounded-lg border border-border">
      <div className="flex gap-1 border-b border-border p-1">
        {(["write", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1 text-xs capitalize ${
              tab === t ? "bg-white/10 text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "write" ? (
        <textarea
          name={name}
          rows={rows}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full resize-y bg-transparent px-3 py-2 font-mono text-sm focus:outline-none"
        />
      ) : (
        <div className="max-h-[400px] overflow-y-auto px-3 py-2">
          {value ? <Markdown>{value}</Markdown> : <p className="text-sm text-muted">Nothing to preview.</p>}
        </div>
      )}
    </div>
  );
}
