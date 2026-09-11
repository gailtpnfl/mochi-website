import type { Metadata } from "next";
import Link from "next/link";
import { BigBossCalculator } from "@/components/bigboss-calculator";

export const metadata: Metadata = { title: "BigBoss Calculator" };

export default function BigBossCalculatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/tools" className="text-sm text-muted hover:text-foreground">
        &larr; Trading Materials
      </Link>
      <h1 className="section-title mt-3">BigBoss Calculator</h1>
      <p className="mt-3 text-muted">
        Position-size and risk calculator. Runs entirely in your browser &mdash; nothing is
        sent to a server.
      </p>
      <div className="mt-8">
        <BigBossCalculator />
      </div>
    </div>
  );
}
