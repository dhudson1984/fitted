import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fitted — Men's Style, Curated",
    template: "%s | Fitted",
  },
  description:
    "AI-matched outfit curation with shoppable pieces. Premium men's fashion styling made simple.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fitted.replit.app"),
  openGraph: {
    type: "website",
    siteName: "Fitted",
    title: "Fitted — Men's Style, Curated",
    description: "AI-matched outfit curation with shoppable pieces. Premium men's fashion styling made simple.",
  },
  other: {
    "impact-site-verification": "4d523577-d00c-478f-bbdf-bf8a57d6c746",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
