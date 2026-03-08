import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build a Look — AI Outfit Analysis",
  description: "Upload a photo and let AI analyze your outfit. Get matched with curated pieces from premium brands to complete your look.",
};

export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
