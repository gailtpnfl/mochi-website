import type { Metadata } from "next";
import { Markdown } from "@/components/markdown";

export const metadata: Metadata = { title: "Privacy Policy" };

const PRIVACY_MD = `
_Last updated: launch of Phase 1._

## What we collect

- **Account data**: email address, and Discord ID/username if you sign in with Discord.
- **Profile data**: display name and avatar you choose to set.
- **Form submissions**: newsletter email, and partnership inquiry details you submit voluntarily.

## What we don't collect

We never ask for wallet connections, seed phrases, or private keys. Nothing on this site
requires connecting a wallet.

## How we use it

To operate your account, send newsletter updates (if subscribed), and follow up on
partnership inquiries. We do not sell your data.

## Your rights

You can update your display name from your profile, unsubscribe from the newsletter at
any time, and request account deletion by reaching out in Discord or by email.

This is a placeholder policy for the Phase 1 launch and will be expanded with full legal
review before General Availability.
`;

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <div className="mt-8">
        <Markdown>{PRIVACY_MD}</Markdown>
      </div>
    </div>
  );
}
