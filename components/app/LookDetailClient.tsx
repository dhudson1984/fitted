"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Check } from "lucide-react";
import PieceCard from "./PieceCard";
import SwapDrawer from "./SwapDrawer";
import SaveLookButton from "./SaveLookButton";
import LookBackNav from "./LookBackNav";
import AuthPromptModal from "./AuthPromptModal";
import { useBag } from "@/components/providers/BagProvider";
import type { Piece } from "@/lib/types";

interface LookDetailClientProps {
  lookName: string;
  lookSlug: string;
  pieces: (Piece & { sort_order: number })[];
  hideSaveButton?: boolean;
}

export default function LookDetailClient({ lookName, lookSlug, pieces, hideSaveButton }: LookDetailClientProps) {
  const [swapOpen, setSwapOpen] = useState(false);
  const [swapPiece, setSwapPiece] = useState<(Piece & { sort_order: number }) | null>(null);
  const [displayPieces, setDisplayPieces] = useState(pieces);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [allAdded, setAllAdded] = useState(false);
  const { addItem, items } = useBag();

  useEffect(() => {
    try {
      const name = localStorage.getItem("userName");
      setIsAuthenticated(!!name && name.trim().length > 0);
    } catch {}
  }, []);

  useEffect(() => {
    const allInBag = displayPieces.length > 0 && displayPieces.every((p) => items.some((i) => i.id === p.id));
    setAllAdded(allInBag);
  }, [items, displayPieces]);

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

  const handleAddAll = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    displayPieces.forEach((piece) => {
      if (!items.some((i) => i.id === piece.id)) {
        addItem({
          id: piece.id,
          brand: piece.brand,
          name: piece.name,
          price: piece.price,
          priceStr: piece.price_display,
          retailer: piece.retailer,
          look: lookName,
        });
      }
    });
    setAllAdded(true);
  };

  return (
    <>
      {!isAuthenticated && <LookBackNav />}

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        <div
          data-testid="look-action-buttons"
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 32,
            maxWidth: 520,
          }}
        >
          <div style={{ flex: 1 }}>
            <button
              data-testid="button-add-all-to-bag"
              onClick={handleAddAll}
              disabled={allAdded}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                padding: "13px 16px",
                background: allAdded ? "var(--stone)" : "var(--charcoal)",
                color: "var(--cream)",
                border: "none",
                fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: allAdded ? "default" : "pointer",
                transition: "all 0.2s",
                opacity: allAdded ? 0.8 : 1,
              }}
              onMouseEnter={(e) => {
                if (!allAdded) e.currentTarget.style.background = "var(--bark)";
              }}
              onMouseLeave={(e) => {
                if (!allAdded) e.currentTarget.style.background = "var(--charcoal)";
              }}
            >
              {allAdded ? (
                <>
                  <Check size={14} />
                  All Added
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  Add All to Bag
                </>
              )}
            </button>
          </div>
          {!hideSaveButton && (
            <div style={{ flex: 1 }}>
              <SaveLookButton lookSlug={lookSlug} lookName={lookName} />
            </div>
          )}
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

      <AuthPromptModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
