"use client";

import { useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import type { Piece } from "@/lib/types";
import { trackAffiliateClick } from "@/lib/analytics";
import AddToBagButton from "./AddToBagButton";
import SaveItemButton from "./SaveItemButton";
import PieceModal from "./PieceModal";

interface PieceCardProps {
  piece: Piece & { sort_order: number };
  lookName: string;
  lookSlug?: string;
  onSwap?: (piece: Piece & { sort_order: number }) => void;
}

const SLOT_LABELS: Record<string, string> = {
  shirt: "Shirt",
  jacket: "Jacket",
  pants: "Pants",
  shoes: "Shoes",
  accessory: "Accessory",
  top: "Top",
  bottom: "Bottom",
  outerwear: "Outerwear",
  footwear: "Footwear",
  layer: "Layer",
};

export default function PieceCard({ piece, lookName, lookSlug, onSwap }: PieceCardProps) {
  const slotLabel = SLOT_LABELS[piece.slot_type] || piece.slot_type;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
    <div
      data-testid={`card-piece-${piece.id}`}
      style={{
        background: "var(--warm-white)",
        border: "1px solid var(--sand)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        data-testid={`button-expand-piece-${piece.id}`}
        onClick={() => setModalOpen(true)}
        aria-label={`View ${piece.name}`}
        style={{
          width: "100%",
          aspectRatio: "4/3",
          background: "var(--cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          cursor: "pointer",
          padding: 0,
          transition: "background 0.2s",
          flexDirection: "column",
          gap: 8,
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          if (!piece.image_url) e.currentTarget.style.background = "#ede8df";
        }}
        onMouseLeave={(e) => {
          if (!piece.image_url) e.currentTarget.style.background = "var(--cream)";
        }}
      >
        {piece.image_url ? (
          <img
            data-testid={`img-piece-${piece.id}`}
            src={piece.image_url}
            alt={piece.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--stone)",
                fontWeight: 500,
              }}
            >
              {slotLabel}
            </div>
            <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "var(--stone)", opacity: 0.6, fontFamily: "'DM Sans', sans-serif" }}>
              tap to expand
            </div>
          </>
        )}
      </button>

      <div style={{ padding: "16px 16px 12px", flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              data-testid={`text-piece-brand-${piece.id}`}
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--bark)",
                fontWeight: 500,
              }}
            >
              {piece.brand}
            </div>
            <SaveItemButton piece={piece} />
          </div>
          <div
            data-testid={`text-piece-slot-${piece.id}`}
            style={{
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              background: "var(--cream)",
              padding: "2px 8px",
              fontWeight: 500,
            }}
          >
            {slotLabel}
          </div>
        </div>

        <button
          data-testid={`button-piece-name-${piece.id}`}
          onClick={() => setModalOpen(true)}
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "var(--charcoal)",
            marginBottom: 6,
            lineHeight: 1.4,
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textAlign: "left",
            transition: "color 0.2s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--bark)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
        >
          <span data-testid={`text-piece-name-${piece.id}`}>{piece.name}</span>
        </button>

        <div
          data-testid={`text-piece-price-${piece.id}`}
          style={{
            fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
            fontSize: 20,
            fontWeight: 300,
            color: "var(--charcoal)",
            marginBottom: 10,
          }}
        >
          {piece.price_display}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 14,
          }}
        >
          {piece.color && (
            <span
              data-testid={`text-piece-color-${piece.id}`}
              style={{
                fontSize: 10,
                color: "var(--muted)",
                background: "var(--cream)",
                padding: "3px 8px",
                letterSpacing: "0.06em",
              }}
            >
              {piece.color}
            </span>
          )}
          {piece.material && (
            <span
              data-testid={`text-piece-material-${piece.id}`}
              style={{
                fontSize: 10,
                color: "var(--muted)",
                background: "var(--cream)",
                padding: "3px 8px",
                letterSpacing: "0.06em",
              }}
            >
              {piece.material}
            </span>
          )}
          {piece.fit_type && (
            <span
              data-testid={`text-piece-fit-${piece.id}`}
              style={{
                fontSize: 10,
                color: "var(--muted)",
                background: "var(--cream)",
                padding: "3px 8px",
                letterSpacing: "0.06em",
              }}
            >
              {piece.fit_type}
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: "0 16px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        <AddToBagButton piece={piece} lookName={lookName} />

        {onSwap && (
          <button
            data-testid={`button-swap-${piece.id}`}
            onClick={() => onSwap(piece)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              width: "100%",
              padding: "9px 16px",
              border: "1px solid var(--sand)",
              background: "transparent",
              color: "var(--charcoal)",
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--stone)";
              e.currentTarget.style.background = "var(--cream)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--sand)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <RefreshCw size={11} />
            Swap
          </button>
        )}

        {piece.retailer_url && (
          <a
            data-testid={`link-retailer-${piece.id}`}
            href={piece.retailer_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackAffiliateClick({
                pieceId: piece.id,
                retailer: piece.retailer,
                lookSlug: lookSlug || "direct",
              });
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "9px 16px",
              border: "1px solid var(--sand)",
              background: "transparent",
              color: "var(--bark)",
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--stone)";
              e.currentTarget.style.background = "var(--cream)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--sand)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            View at {piece.retailer}
            <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>

    <PieceModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      piece={piece}
      lookName={lookName}
      lookSlug={lookSlug}
      onSwap={onSwap}
    />
    </>
  );
}
