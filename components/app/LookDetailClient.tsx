"use client";

import { useState } from "react";
import PieceCard from "./PieceCard";
import SwapDrawer from "./SwapDrawer";
import SaveLookButton from "./SaveLookButton";
import LookBackNav from "./LookBackNav";
import type { Piece } from "@/lib/types";

interface LookDetailClientProps {
  lookName: string;
  lookSlug: string;
  pieces: (Piece & { sort_order: number })[];
}

export default function LookDetailClient({ lookName, lookSlug, pieces }: LookDetailClientProps) {
  const [swapOpen, setSwapOpen] = useState(false);
  const [swapPiece, setSwapPiece] = useState<(Piece & { sort_order: number }) | null>(null);
  const [displayPieces, setDisplayPieces] = useState(pieces);

  const handleOpenSwap = (piece: Piece & { sort_order: number }) => {
    setSwapPiece(piece);
    setSwapOpen(true);
  };

  const handleSwap = (oldPieceId: string, newPiece: Piece) => {
    setDisplayPieces((prev) =>
      prev.map((p) =>
        p.id === oldPieceId ? { ...newPiece, sort_order: p.sort_order } : p
      )
    );
  };

  return (
    <>
      <LookBackNav />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        <div style={{ maxWidth: 280, marginBottom: 32 }}>
          <SaveLookButton lookSlug={lookSlug} lookName={lookName} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <h2
            data-testid="text-pieces-heading"
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 24,
              fontWeight: 300,
              color: "var(--charcoal)",
              marginBottom: 4,
            }}
          >
            The Pieces
          </h2>
          <p
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: "var(--muted)",
              marginBottom: 24,
            }}
          >
            {displayPieces.length} item{displayPieces.length !== 1 ? "s" : ""} in this look
          </p>
        </div>

        <div
          data-testid="pieces-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {displayPieces.map((piece) => (
            <PieceCard
              key={piece.id}
              piece={piece}
              lookName={lookName}
              lookSlug={lookSlug}
              onSwap={handleOpenSwap}
            />
          ))}
        </div>
      </div>

      <SwapDrawer
        isOpen={swapOpen}
        onClose={() => setSwapOpen(false)}
        currentPiece={swapPiece}
        lookName={lookName}
        onSwap={handleSwap}
      />
    </>
  );
}
