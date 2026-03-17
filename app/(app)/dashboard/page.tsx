import type { Metadata } from "next";
import { getCategoryCounts } from "@/lib/data";
import DashboardWelcome from "@/components/app/DashboardWelcome";
import CategoryCard from "@/components/app/CategoryCard";
import PickedForYou from "@/components/app/PickedForYou";
import SavedLooksSection from "@/components/app/SavedLooksSection";
import DashboardGreeting from "./DashboardGreeting";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — Your Style Home",
  description: "Your personalized Fitted dashboard. Browse curated outfit categories, see looks picked for you, and start building your wardrobe.",
};

export default async function DashboardPage() {
  const categoryCounts = await getCategoryCounts();

  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen"
      style={{ background: "var(--warm-white)" }}
    >
      <DashboardWelcome />

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <DashboardGreeting />

        <PickedForYou />

        <section data-testid="section-build-cta" className="mb-12">
          <Link
            href="/build"
            data-testid="link-build-cta"
            className="block no-underline group"
          >
            <div
              className="relative overflow-hidden"
              style={{
                background: "var(--charcoal)",
                padding: "52px 48px",
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: "radial-gradient(circle at 20% 50%, rgba(250,247,242,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(250,247,242,0.15) 0%, transparent 40%)",
                }}
              />

              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div
                    data-testid="text-build-cta-eyebrow"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--stone)",
                      marginBottom: 10,
                    }}
                  >
                    Your Virtual Stylist
                  </div>
                  <h3
                    data-testid="text-build-cta-title"
                    style={{
                      fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
                      fontSize: "clamp(22px, 2.5vw, 34px)",
                      fontWeight: 300,
                      color: "var(--cream)",
                      lineHeight: 1.2,
                      maxWidth: 460,
                      margin: 0,
                    }}
                  >
                    Got an image in mind? Upload it and we&apos;ll build the look for you.
                  </h3>
                </div>

                <div
                  className="inline-flex items-center gap-2 shrink-0 transition-colors group-hover:bg-[var(--stone)]"
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--charcoal)",
                    background: "var(--cream)",
                    border: "none",
                    padding: "14px 32px",
                    fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  Build a Look
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        </section>

        <div id="saved">
          <SavedLooksSection />
        </div>

        <section data-testid="section-categories" className="mb-12">
          <h2
            data-testid="text-categories-title"
            className="font-display text-2xl font-light tracking-wide mb-5"
            style={{ color: "var(--charcoal)" }}
          >
            Explore Categories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryCounts.map((cat) => (
              <CategoryCard
                key={cat.category}
                category={cat.category}
                count={cat.count}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
