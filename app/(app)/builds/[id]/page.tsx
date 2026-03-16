"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Paintbrush } from "lucide-react";
import { supabase } from "@/lib/supabase";
import LookDetailClient from "@/components/app/LookDetailClient";
import type { Piece } from "@/lib/types";

interface SavedBuild {
  id: string;
  name: string;
  pieceIds: string[];
  pieces: { id: string; brand: string; name: string; price: number; price_display: string; slot_type: string; color: string }[];
  analysis: { formality: string; vibe: string; colors: string[] } | null;
  thumbnail: string | null;
  createdAt: string;
}

export default function BuildDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [build, setBuild] = useState<SavedBuild | null>(null);
  const [pieces, setPieces] = useState<(Piece & { sort_order: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadBuild = useCallback(async () => {
    setLoading(true);
    setError(false);
    setBuild(null);
    setPieces([]);

    try {
      const raw = localStorage.getItem("fitted_builds");
      if (!raw) { setError(true); setLoading(false); return; }
      const builds: SavedBuild[] = JSON.parse(raw);
      const found = builds.find((b) => b.id === params.id);
      if (!found) { setError(true); setLoading(false); return; }
      setBuild(found);

      const ids = found.pieceIds;
      if (!ids || ids.length === 0) { setLoading(false); return; }

      const makeFallback = (p: SavedBuild["pieces"][number], i: number): Piece & { sort_order: number } => ({
        id: p.id,
        brand: p.brand,
        name: p.name,
        price: p.price,
        price_display: p.price_display,
        retailer: "",
        retailer_url: "",
        slot_type: p.slot_type,
        color: p.color,
        material: "",
        fit_type: "",
        description: "",
        sort_order: i,
      });

      const { data, error: dbError } = await supabase
        .from("pieces")
        .select("*")
        .in("id", ids);

      if (dbError || !data) {
        setPieces(found.pieces.map((p, i) => makeFallback(p, i)));
        setLoading(false);
        return;
      }

      const ordered = ids.map((id, i) => {
        const piece = data.find((p: Piece) => p.id === id);
        if (piece) return { ...piece, sort_order: i };
        const saved = found.pieces.find((p) => p.id === id);
        return saved ? makeFallback(saved, i) : null;
      }).filter(Boolean) as (Piece & { sort_order: number })[];

      setPieces(ordered);
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [params.id]);

  useEffect(() => { loadBuild(); }, [loadBuild]);

  if (loading) {
    return (
      <div
        data-testid="build-detail-loading"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--warm-white)",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            border: "2px solid var(--sand)",
            borderTopColor: "var(--charcoal)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  if (error || !build) {
    return (
      <div
        data-testid="build-detail-error"
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--warm-white)",
          gap: 16,
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
            fontSize: 24,
            fontWeight: 300,
            color: "var(--charcoal)",
          }}
        >
          Build not found
        </p>
        <button
          data-testid="button-back-dashboard"
          onClick={() => router.push("/dashboard")}
          style={{
            padding: "12px 28px",
            background: "var(--charcoal)",
            color: "var(--cream)",
            border: "none",
            fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const gradient = build.analysis?.vibe
    ? getVibeGradient(build.analysis.vibe)
    : "linear-gradient(165deg, #5C5A6E 0%, #3A3848 40%, #1E1C28 100%)";

  const tags = [
    ...(build.analysis?.formality ? [{ label: build.analysis.formality, type: "formality" }] : []),
    ...(build.analysis?.vibe ? [{ label: build.analysis.vibe, type: "vibe" }] : []),
  ];

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--warm-white)" }}
      data-testid="build-detail-page"
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: gradient,
          padding: "48px 24px 56px",
        }}
      >
        {build.thumbnail && (
          <img
            src={build.thumbnail}
            alt={build.name}
            data-testid="img-build-hero"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.35,
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(26,26,24,0.7) 0%, rgba(26,26,24,0.3) 60%, transparent 100%)",
          }}
        />
        <div
          className="relative"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            zIndex: 1,
          }}
        >
          <h1
            data-testid="text-build-name"
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 300,
              color: "rgba(250,247,242,0.95)",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            {build.name}
          </h1>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span
              data-testid="badge-your-build"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: "rgba(250,247,242,0.9)",
                background: "rgba(250,247,242,0.18)",
                padding: "5px 12px",
                borderRadius: 3,
              }}
            >
              <Paintbrush size={10} />
              Your Build
            </span>
            {tags.map((tag) => (
              <span
                key={tag.type}
                data-testid={`badge-${tag.type}`}
                style={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: "rgba(250,247,242,0.6)",
                  background: "rgba(250,247,242,0.08)",
                  padding: "5px 12px",
                  borderRadius: 3,
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {pieces.length > 0 && (
        <LookDetailClient
          lookName={build.name}
          lookSlug={build.id}
          pieces={pieces}
          hideSaveButton
        />
      )}

      {pieces.length === 0 && (
        <div
          data-testid="build-no-pieces"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "64px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 15,
              fontWeight: 300,
              color: "var(--muted)",
              lineHeight: 1.7,
            }}
          >
            No pieces found for this build.
          </p>
        </div>
      )}
    </main>
  );
}

function getVibeGradient(vibe: string): string {
  const map: Record<string, string> = {
    "Relaxed": "linear-gradient(165deg, #8B7355 0%, #6B5A3E 40%, #3C2E1C 100%)",
    "Classic": "linear-gradient(165deg, #4A5568 0%, #2D3748 40%, #1A202C 100%)",
    "Earthy": "linear-gradient(165deg, #6B4E32 0%, #4A3520 40%, #2A1E12 100%)",
    "Minimal": "linear-gradient(165deg, #718096 0%, #4A5568 40%, #2D3748 100%)",
    "Sharp": "linear-gradient(165deg, #2C2C2A 0%, #1A1A18 40%, #0D0D0C 100%)",
  };
  return map[vibe] || "linear-gradient(165deg, #5C5A6E 0%, #3A3848 40%, #1E1C28 100%)";
}
