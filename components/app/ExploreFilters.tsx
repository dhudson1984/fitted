"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { getFilterOptions } from "@/lib/types";

export default function ExploreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const options = getFilterOptions();

  const currentVibe = searchParams.get("vibe") || "";
  const currentOccasion = searchParams.get("occasion") || "";
  const currentSeason = searchParams.get("season") || "";
  const currentSort = searchParams.get("sort") || "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/explore?${params.toString()}`);
    },
    [router, searchParams]
  );

  const hasActiveFilters = currentVibe || currentOccasion || currentSeason;

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams();
    const category = searchParams.get("category");
    if (category) params.set("category", category);
    router.push(`/explore?${params.toString()}`);
  }, [router, searchParams]);

  const selectStyle: React.CSSProperties = {
    appearance: "none",
    WebkitAppearance: "none",
    background: "var(--warm-white)",
    border: "1.5px solid var(--sand)",
    borderRadius: 6,
    padding: "8px 32px 8px 12px",
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: "0.04em",
    color: "var(--charcoal)",
    fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
    cursor: "pointer",
    transition: "border-color 0.2s",
    minWidth: 120,
  };

  return (
    <div
      data-testid="explore-filters"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 10,
        padding: "16px 0",
      }}
    >
      <div style={{ position: "relative" }}>
        <select
          data-testid="select-vibe"
          value={currentVibe}
          onChange={(e) => updateFilter("vibe", e.target.value)}
          style={selectStyle}
        >
          <option value="">Vibe</option>
          {options.vibes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "var(--muted)",
          }}
        />
      </div>

      <div style={{ position: "relative" }}>
        <select
          data-testid="select-occasion"
          value={currentOccasion}
          onChange={(e) => updateFilter("occasion", e.target.value)}
          style={selectStyle}
        >
          <option value="">Occasion</option>
          {options.occasions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "var(--muted)",
          }}
        />
      </div>

      <div style={{ position: "relative" }}>
        <select
          data-testid="select-season"
          value={currentSeason}
          onChange={(e) => updateFilter("season", e.target.value)}
          style={selectStyle}
        >
          <option value="">Season</option>
          {options.seasons.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "var(--muted)",
          }}
        />
      </div>

      <div
        style={{
          width: 1,
          height: 24,
          background: "var(--sand)",
          flexShrink: 0,
        }}
      />

      <div style={{ position: "relative" }}>
        <select
          data-testid="select-sort"
          value={currentSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          style={selectStyle}
        >
          <option value="">Sort: Newest</option>
          <option value="name">Sort: A-Z</option>
        </select>
        <ChevronDown
          size={14}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "var(--muted)",
          }}
        />
      </div>

      {hasActiveFilters && (
        <button
          data-testid="button-clear-filters"
          onClick={clearFilters}
          style={{
            background: "none",
            border: "none",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--bark)",
            cursor: "pointer",
            padding: "8px 4px",
            fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--bark)")}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
