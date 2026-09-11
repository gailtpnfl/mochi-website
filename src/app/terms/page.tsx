import type { Metadata } from "next";
import { Markdown } from "@/components/markdown";

export const metadata: Metadata = { title: "Terms of Use" };

const TERMS_MD = `
_Last updated: launch of Phase 1._

## Educational content only

Mochi Web3 provides curated airdrop listings, guides, and (in later phases) trading
education and tools. Nothing on this site is financial, investment, or trading advice.
Crypto and Web3 assets carry risk, including total loss of funds.

## No warranty on third-party links

Airdrop guides and partner listings link to third-party sites we don't control. We
curate carefully, but you're responsible for verifying any site before connecting a
wallet or entering personal information there.

## Community conduct

Accounts found scamming, harassing other members, or violating our Discord guidelines
may be suspended or removed.

## Changes

We'll update these terms as new features (mentorship, trading journal, NFT galleries)
ship in later phases.

This is a placeholder for the Phase 1 launch and will be expanded with full legal
review before General Availability.
`;

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Terms of Use</h1>
      <div className="mt-8">
        <Markdown>{TERMS_MD}</Markdown>
      </div>
    </div>
  );
}
