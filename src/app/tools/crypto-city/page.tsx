import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Mochi Crypto City" };

export default function CryptoCityPage() {
  return (
    <ComingSoon
      title="Mochi Crypto City"
      description="This concept is still being defined by the team. Placeholder until it has a one-page spec."
      phase={2}
    />
  );
}
