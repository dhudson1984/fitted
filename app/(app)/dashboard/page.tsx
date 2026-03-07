import { getLooks, getCategoryCounts } from "@/lib/data";
import DashboardWelcome from "@/components/app/DashboardWelcome";
import LookCard from "@/components/app/LookCard";
import CategoryCard from "@/components/app/CategoryCard";
import DashboardGreeting from "./DashboardGreeting";
import Link from "next/link";
import { ArrowRight, Wand2 } from "lucide-react";

export default async function DashboardPage() {
  const [looks, categoryCounts] = await Promise.all([
    getLooks({ limit: 6, withImages: true }),
    getCategoryCounts(),
  ]);

  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen"
      style={{ background: "var(--warm-white)" }}
    >
      <DashboardWelcome />

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <DashboardGreeting />

        <section data-testid="section-picked-for-you" className="mb-12">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
            <h2
              data-testid="text-picked-title"
              className="font-display text-2xl font-light tracking-wide"
              style={{ color: "var(--charcoal)" }}
            >
              Picked For You
            </h2>
            <Link
              href="/explore"
              data-testid="link-see-all-looks"
              className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.1em] uppercase no-underline transition-colors"
              style={{ color: "var(--bark)" }}
            >
              See All
              <ArrowRight size={13} />
            </Link>
          </div>

          <div
            data-testid="scroll-picked-looks"
            className="flex gap-4 overflow-x-auto pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {looks.map((look) => (
              <LookCard key={look.id} look={look} />
            ))}
          </div>
        </section>

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
