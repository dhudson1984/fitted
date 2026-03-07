import { Suspense } from "react";
import Link from "next/link";
import { getLooks, getFilterOptions } from "@/lib/data";
import LookCard from "@/components/app/LookCard";
import ExploreFilters from "@/components/app/ExploreFilters";

const CATEGORIES = ["All", "Smart Casual", "Work", "Athletic & Outdoors", "Night Out"];

function getCategorySlug(cat: string): string {
  return cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { category?: string; vibe?: string; occasion?: string; season?: string; sort?: string };
}) {
  const filters: Record<string, string> = {};
  if (searchParams.category && searchParams.category !== "All") filters.category = searchParams.category;
  if (searchParams.vibe) filters.vibe = searchParams.vibe;
  if (searchParams.occasion) filters.occasion = searchParams.occasion;
  if (searchParams.season) filters.season = searchParams.season;
  if (searchParams.sort) filters.sort = searchParams.sort;

  const looks = await getLooks(filters);
  const activeCategory = searchParams.category || "All";
  const displayName = activeCategory === "All" ? "All Looks" : activeCategory;

  return (
    <div
      data-testid="explore-page"
      style={{ background: "var(--warm-white)", minHeight: "100vh" }}
    >
      <div
        data-testid="explore-hero"
        style={{
          padding: "48px 28px 32px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          data-testid="text-explore-eyebrow"
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--bark)",
            marginBottom: 8,
          }}
        >
          Explore{activeCategory !== "All" ? ` / ${activeCategory}` : ""}
        </div>
        <h1
          data-testid="text-explore-title"
          style={{
            fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
            fontSize: 40,
            fontWeight: 300,
            color: "var(--charcoal)",
            lineHeight: 1.1,
            marginBottom: 6,
          }}
        >
          {displayName}
        </h1>
        <div
          data-testid="text-explore-count"
          style={{
            fontSize: 13,
            fontWeight: 300,
            color: "var(--muted)",
          }}
        >
          {looks.length} look{looks.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
        <div
          data-testid="explore-category-tabs"
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1.5px solid var(--sand)",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat || (cat === "All" && !searchParams.category);
            const href = cat === "All" ? "/explore" : `/explore?category=${encodeURIComponent(cat)}`;
            return (
              <Link
                key={cat}
                href={href}
                data-testid={`tab-category-${getCategorySlug(cat)}`}
                style={{
                  padding: "12px 20px",
                  fontSize: 12,
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: isActive ? "var(--charcoal)" : "var(--muted)",
                  textDecoration: "none",
                  borderBottom: isActive ? "2px solid var(--charcoal)" : "2px solid transparent",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s, border-color 0.2s",
                  flexShrink: 0,
                  fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                }}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        <Suspense fallback={null}>
          <ExploreFilters />
        </Suspense>

        {looks.length === 0 ? (
          <div
            data-testid="explore-empty-state"
            style={{
              textAlign: "center",
              padding: "80px 20px",
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
                fontSize: 24,
                fontWeight: 300,
                color: "var(--charcoal)",
                marginBottom: 8,
              }}
            >
              No looks found
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 300,
                color: "var(--muted)",
                marginBottom: 24,
              }}
            >
              Try adjusting your filters or browsing a different category.
            </div>
            <Link
              href="/explore"
              data-testid="link-clear-all"
              style={{
                display: "inline-block",
                padding: "10px 24px",
                background: "var(--charcoal)",
                color: "var(--cream)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: 4,
                fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              }}
            >
              View All Looks
            </Link>
          </div>
        ) : (
          <div
            data-testid="explore-look-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
              padding: "8px 0 60px",
            }}
          >
            {looks.map((look) => (
              <LookCard key={look.id} look={look} variant="explore" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
