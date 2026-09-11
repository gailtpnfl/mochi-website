import type { Metadata } from "next";
import { Caveat, DM_Mono, DM_Sans, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Chrome } from "@/components/chrome";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

// The OTF reports usWeightClass 900. Declaring it stops the browser
// synthesising a faux-bold when headings ask for 700/800 against a face that
// would otherwise be registered at the default 400.
const uraniaBlack = localFont({
  src: "../../public/fonts/urania-black.otf",
  variable: "--font-urania",
  display: "swap",
  weight: "900",
});

// Handles, social labels, and the "SOON" state on the Core Team page. A genuine
// addition to the type system rather than a one-page font — see
// design-reference/css/tokens.css.
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Handwritten-marginalia feel for the "Meet the Core Team" callout note on
// the /core-team overlay — the only spot on the site that wants a script
// face, so it's kept as its own variable rather than folded into the display
// font.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mochi Web3 — Community, Education, Airdrops",
    template: "%s | Mochi Web3",
  },
  description:
    "Mochi Web3 is a community platform for curated airdrop hunting, Web3 education, and trading tools.",
  openGraph: {
    title: "Mochi Web3",
    description:
      "Curated airdrop hunting, Web3 education, and trading tools — built by and for the Mochi community.",
    url: siteUrl,
    siteName: "Mochi Web3",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${uraniaBlack.variable} ${dmMono.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
