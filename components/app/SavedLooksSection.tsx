"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, X, ArrowRight, RefreshCw, Paintbrush } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getGradient } from "@/lib/types";
import type { Look, Piece } from "@/lib/types";

interface SavedItem {
  pieceId: string;
  brand: string;
  name: string;
  price: number;
  priceStr: string;
  savedAt: string;
}

interface SavedBuild {
  id: string;
  name: string;
  pieceIds: string[];
  pieces: { id: string; brand: string; name: string; price: number; price_display: string; slot_type: string; color: string }[];
  analysis: { formality: string; vibe: string; colors: string[] } | null;
  thumbnail: string | null;
  createdAt: string;
}

export default function SavedLooksSection() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [savedLooks, setSavedLooks] = useState<Look[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const slugs = JSON.parse(localStorage.getItem("fitted_saved_looks") || "[]");
      setSavedSlugs(slugs);

      const items = JSON.parse(localStorage.getItem("fitted_saved_items") || "[]");
      setSavedItems(items);

      const builds = JSON.parse(localStorage.getItem("fitted_builds") || "[]");
      setSavedBuilds(builds);
    } catch {}

    setLoading(false);
  }, []);

  useEffect(() => {
    if (savedSlugs.length === 0) return;

    async function fetchLooks() {
      const { data } = await supabase
        .from("looks")
        .select("*")
        .in("slug", savedSlugs);
      if (data) setSavedLooks(data);
    }
    fetchLooks();
  }, [savedSlugs]);

  const removeLook = (slug: string) => {
    const updated = savedSlugs.filter((s) => s !== slug);
    setSavedSlugs(updated);
    setSavedLooks((prev) => prev.filter((l) => l.slug !== slug));
    localStorage.setItem("fitted_saved_looks", JSON.stringify(updated));
  };

  const removeBuild = (buildId: string) => {
    const updated = savedBuilds.filter((b) => b.id !== buildId);
    setSavedBuilds(updated);
    localStorage.setItem("fitted_builds", JSON.stringify(updated));
  };

  const removeItem = (pieceId: string) => {
    const updated = savedItems.filter((i) => i.pieceId !== pieceId);
    setSavedItems(updated);
    localStorage.setItem("fitted_saved_items", JSON.stringify(updated));
  };

  if (loading) {
    return (
      <section id="saved" data-testid="section-saved-looks" style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40, color: "var(--muted)" }}>
          <RefreshCw size={16} style={{ animation: "spin 1s linear infinite", marginRight: 8 }} />
          Loading...
        </div>
      </section>
    );
  }

  const totalOutfits = savedLooks.length + savedBuilds.length;

  if (savedSlugs.length === 0 && savedItems.length === 0 && savedBuilds.length === 0) return null;

  return (
    <section id="saved" data-testid="section-saved-looks" style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
        <h2
          data-testid="text-saved-looks-title"
          style={{
            fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
            fontSize: 26,
            fontWeight: 300,
            color: "var(--charcoal)",
          }}
        >
          Saved
        </h2>
        <Link
          href="/lookboard"
          data-testid="link-view-all-saved"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--bark)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 4,
            transition: "color 0.2s",
          }}
        >
          View All <ArrowRight size={12} />
        </Link>
      </div>

      {totalOutfits > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div
            data-testid="text-saved-outfits-label"
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            Saved Outfits ({totalOutfits})
          </div>
          <div
            data-testid="saved-outfits-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {savedBuilds.slice(0, 4).map((build) => (
              <div
                key={build.id}
                data-testid={`saved-build-${build.id}`}
                style={{ position: "relative" }}
              >
                <Link
                  href="/build"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div
                    style={{
                      background: "linear-gradient(165deg, #5C5A6E 0%, #3A3848 40%, #1E1C28 100%)",
                      height: 160,
                      display: "flex",
                      alignItems: "flex-end",
                      padding: 16,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {build.thumbnail && (
                      <img
                        src={build.thumbnail}
                        alt={build.name}
                        data-testid={`img-build-thumb-${build.id}`}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: 0.4,
                        }}
                      />
                    )}
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 9,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "rgba(250,247,242,0.6)",
                          marginBottom: 4,
                        }}
                      >
                        <Paintbrush size={9} />
                        Your Build
                      </div>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
                          fontSize: 18,
                          fontWeight: 300,
                          color: "rgba(250,247,242,0.95)",
                          lineHeight: 1.2,
                        }}
                      >
                        {build.name}
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  data-testid={`button-remove-build-${build.id}`}
                  onClick={() => removeBuild(build.id)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(26,26,24,0.5)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(250,247,242,0.7)",
                    transition: "all 0.2s",
                    zIndex: 2,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(26,26,24,0.8)";
                    e.currentTarget.style.color = "rgba(250,247,242,1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(26,26,24,0.5)";
                    e.currentTarget.style.color = "rgba(250,247,242,0.7)";
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {savedLooks.slice(0, Math.max(0, 4 - savedBuilds.length)).map((look) => {
              const gradient = getGradient(look);
              return (
                <div
                  key={look.slug}
                  data-testid={`saved-look-${look.slug}`}
                  style={{ position: "relative" }}
                >
                  <Link
                    href={`/looks/${look.slug}`}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <div
                      style={{
                        background: gradient,
                        height: 160,
                        display: "flex",
                        alignItems: "flex-end",
                        padding: 16,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {look.image_url && (
                        <img
                          src={look.image_url}
                          alt={look.name}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.3,
                          }}
                        />
                      )}
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <div
                          style={{
                            fontSize: 9,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "rgba(250,247,242,0.6)",
                            marginBottom: 4,
                          }}
                        >
                          {look.category}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
                            fontSize: 18,
                            fontWeight: 300,
                            color: "rgba(250,247,242,0.95)",
                            lineHeight: 1.2,
                          }}
                        >
                          {look.name}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button
                    data-testid={`button-remove-look-${look.slug}`}
                    onClick={() => removeLook(look.slug)}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "rgba(26,26,24,0.5)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "rgba(250,247,242,0.7)",
                      transition: "all 0.2s",
                      zIndex: 2,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(26,26,24,0.8)";
                      e.currentTarget.style.color = "rgba(250,247,242,1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(26,26,24,0.5)";
                      e.currentTarget.style.color = "rgba(250,247,242,0.7)";
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {savedItems.length > 0 && (
        <div>
          <div
            data-testid="text-saved-items-label"
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            Saved Items ({savedItems.length})
          </div>
          <div
            data-testid="saved-items-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              background: "var(--sand)",
              border: "1px solid var(--sand)",
            }}
          >
            {savedItems.slice(0, 6).map((item) => (
              <div
                key={item.pieceId}
                data-testid={`saved-item-${item.pieceId}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 20px",
                  background: "var(--warm-white)",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "var(--cream)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ShoppingBag size={14} style={{ color: "var(--stone)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--bark)", marginBottom: 2 }}>
                    {item.brand}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--charcoal)", fontWeight: 400 }}>
                    {item.name}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 300, color: "var(--charcoal)", flexShrink: 0 }}>
                  {item.priceStr}
                </div>
                <button
                  data-testid={`button-remove-item-${item.pieceId}`}
                  onClick={() => removeItem(item.pieceId)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--stone)",
                    transition: "color 0.2s",
                    flexShrink: 0,
                    padding: 4,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--stone)")}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
