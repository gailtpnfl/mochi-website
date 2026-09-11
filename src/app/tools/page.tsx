import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import type { TradingTool } from "@/lib/types";

export const metadata: Metadata = { title: "Trading Materials" };

const ACCESS_LABEL: Record<TradingTool["access"], string> = {
  public: "Public",
  members: "Members",
  mentees: "Mentees",
};

export default async function ToolsPage() {
  const supabase = await createClient();
  const [{ data }, user] = await Promise.all([
    supabase.from("trading_tools").select("*").order("position"),
    getCurrentUser(),
  ]);

  const tools = (data ?? []) as TradingTool[];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <span className="section-eyebrow">05 &middot; Tools</span>
      <h1 className="section-title">Trading Materials</h1>
      <p className="section-sub">
        The member tools hub: calculators, watchlists, and indicators. Education and tooling,
        never financial advice.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => {
          const locked = tool.access !== "public" && !user;
          return (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="mw-card mw-card-lift flex flex-col gap-2 p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold">{tool.name}</h2>
                {locked ? (
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Lock size={12} /> {ACCESS_LABEL[tool.access]}
                  </span>
                ) : (
                  tool.access !== "public" && (
                    <span className="chip chip-muted">{ACCESS_LABEL[tool.access]}</span>
                  )
                )}
              </div>
              {tool.description && <p className="text-sm text-muted">{tool.description}</p>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
