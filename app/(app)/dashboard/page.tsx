import type { Metadata } from "next";
import { getCategoryCounts } from "@/lib/data";
import DashboardWelcome from "@/components/app/DashboardWelcome";
import CategoryCard from "@/components/app/CategoryCard";
import PickedForYou from "@/components/app/PickedForYou";
import DashboardGreeting from "./DashboardGreeting";
import Link from "next/link";
import { ArrowRight, Wand2 } from "lucide-react";

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

        <section data-testid="section-build-cta" className="mb-12">
          <Link
            href="/build"
            data-testid="link-build-cta"
            className="block no-underline group"
          >
            <div
              className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10 overflow-hidden transition-transform duration-200"
              style={{
                background: "var(--charcoal)",
                borderRadius: 6,
                padding: "36px 32px",
              }}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(250,247,242,0.08)",
                }}
              >
                <Wand2 size={24} style={{ color: "rgba(250,247,242,0.7)" }} />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3
                  data-testid="text-build-cta-title"
                  className="font-display text-2xl font-light mb-2"
                  style={{ color: "rgba(250,247,242,0.95)" }}
                >
                  Need a complete look?
                </h3>
                <p
                  data-testid="text-build-cta-subtitle"
                  className="text-sm font-light"
                  style={{ color: "rgba(250,247,242,0.5)" }}
                >
                  Tell us the occasion and we&apos;ll put together a head-to-toe outfit for you.
                </p>
              </div>

              <div
                className="flex items-center gap-2 px-5 py-3 text-[11px] font-medium tracking-[0.12em] uppercase shrink-0 transition-colors"
                style={{
                  border: "1.5px solid rgba(250,247,242,0.2)",
                  color: "rgba(250,247,242,0.85)",
                  borderRadius: 4,
                }}
              >
                Build a Look
                <ArrowRight size={13} />
              </div>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
