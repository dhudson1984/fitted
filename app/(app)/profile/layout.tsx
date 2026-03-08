import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Style Profile",
  description: "View and manage your Fitted style profile. See your preferences, sizing, budget, and saved looks all in one place.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
