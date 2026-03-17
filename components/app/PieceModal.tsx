"use client";

import { useEffect } from "react";
import { X, RefreshCw, ExternalLink, ShoppingBag, Check } from "lucide-react";
import type { Piece } from "@/lib/types";
import AddToBagButton from "./AddToBagButton";
import SaveItemButton from "./SaveItemButton";
import { trackAffiliateClick } from "@/lib/analytics";
import { useBag } from "@/components/providers/BagProvider";

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

export interface SavedItemRef {
  pieceId: string;
  brand: string;
  name: string;
  price: number;
  priceStr: string;
}

export interface PieceModalProps {
  isOpen: boolean;
  onClose: () => void;
  piece?: (Piece & { sort_order: number }) | null;
  lookName?: string;
  lookSlug?: string;
  onSwap?: (piece: Piece & { sort_order: number }) => void;
  savedItem?: SavedItemRef | null;
  onRemoveSavedItem?: (pieceId: string) => void;
}

function SavedItemBagButton({ savedItem }: { savedItem: SavedItemRef }) {
  const { addItem, items } = useBag();
  const isInBag = items.some((i) => i.id === savedItem.pieceId);

  return (
    <button
      data-testid={`button-modal-add-bag-${savedItem.pieceId}`}
      disabled={isInBag}
      onClick={() => {
        if (isInBag) return;
        addItem({
          id: savedItem.pieceId,
          brand: savedItem.brand,
          name: savedItem.name,
          price: savedItem.price,
          priceStr: savedItem.priceStr,
          retailer: "",
          look: "",
        });
      }}
      style={{
        width: "100%",
        padding: "11px 16px",
        background: isInBag ? "var(--stone)" : "var(--charcoal)",
        color: "var(--cream)",
        border: "none",
        fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: isInBag ? "default" : "pointer",
        transition: "background 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: isInBag ? 0.8 : 1,
      }}
      onMouseEnter={(e) => { if (!isInBag) e.currentTarget.style.background = "var(--bark)"; }}
      onMouseLeave={(e) => { if (!isInBag) e.currentTarget.style.background = "var(--charcoal)"; }}
    >
      {isInBag ? <><Check size={14} /> In Bag</> : <><ShoppingBag size={14} /> Add to Bag</>}
    </button>
  );
}

export default function PieceModal({
  isOpen,
  onClose,
  piece,
  lookName,
  lookSlug,
  onSwap,
  savedItem,
  onRemoveSavedItem,
}: PieceModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSavedItemMode = !piece && !!savedItem;
  const id = piece?.id ?? savedItem?.pieceId ?? "";
  const brand = piece?.brand ?? savedItem?.brand ?? "";
  const name = piece?.name ?? savedItem?.name ?? "";
  const priceStr = piece?.price_display ?? savedItem?.priceStr ?? "";
  const slotLabel = piece ? (SLOT_LABELS[piece.slot_type] || piece.slot_type) : null;

  return (
    <div
      data-testid="piece-modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,26,24,0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        data-testid={`piece-modal-${id}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--warm-white)",
          width: "100%",
          maxWidth: 720,
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          display: "flex",
          flexDirection: "row",
          animation: "fadeUp 0.25s ease",
        }}
        className="max-md:!flex-col"
      >
        <button
          data-testid="button-piece-modal-close"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
            background: "rgba(250,247,242,0.9)",
            border: "none",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--charcoal)",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cream)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(250,247,242,0.9)")}
        >
          <X size={16} />
        </button>

        <div
          style={{
            width: 260,
            flexShrink: 0,
            background: "var(--cream)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 260,
            gap: 14,
            padding: 24,
          }}
          className="max-md:!w-full max-md:!min-h-[160px]"
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--stone)",
              fontWeight: 500,
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
            }}
          >
            {slotLabel ?? "Piece"}
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 30,
              fontWeight: 300,
              color: "var(--charcoal)",
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            {brand}
          </div>
          {piece?.color && (
            <div
              style={{
                fontSize: 10,
                color: "var(--stone)",
                letterSpacing: "0.08em",
                fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              }}
            >
              {piece.color}
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            padding: "36px 28px 28px",
            display: "flex",
            flexDirection: "column",
          }}
          className="max-md:!px-5 max-md:!pt-5 max-md:!pb-6"
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--bark)",
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            {brand}
          </div>

          <div
            data-testid={`modal-piece-name-${id}`}
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 22,
              fontWeight: 300,
              color: "var(--charcoal)",
              lineHeight: 1.3,
              marginBottom: 10,
            }}
          >
            {name}
          </div>

          <div
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 26,
              fontWeight: 300,
              color: "var(--charcoal)",
              marginBottom: 16,
            }}
          >
            {priceStr}
          </div>

          {piece && (piece.color || piece.material || piece.fit_type) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
              {piece.color && (
                <span style={{ fontSize: 10, color: "var(--muted)", background: "var(--cream)", padding: "3px 8px", letterSpacing: "0.06em" }}>
                  {piece.color}
                </span>
              )}
              {piece.material && (
                <span style={{ fontSize: 10, color: "var(--muted)", background: "var(--cream)", padding: "3px 8px", letterSpacing: "0.06em" }}>
                  {piece.material}
                </span>
              )}
              {piece.fit_type && (
                <span style={{ fontSize: 10, color: "var(--muted)", background: "var(--cream)", padding: "3px 8px", letterSpacing: "0.06em" }}>
                  {piece.fit_type}
                </span>
              )}
            </div>
          )}

          <div style={{ height: 1, background: "var(--sand)", marginBottom: 18 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {piece && lookName && <AddToBagButton piece={piece} lookName={lookName} />}

            {isSavedItemMode && savedItem && <SavedItemBagButton savedItem={savedItem} />}

            {piece && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <SaveItemButton piece={piece} />
              </div>
            )}

            {piece && onSwap && (
              <button
                data-testid={`button-modal-swap-${id}`}
                onClick={() => { onSwap(piece); onClose(); }}
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
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--stone)"; e.currentTarget.style.background = "var(--cream)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--sand)"; e.currentTarget.style.background = "transparent"; }}
              >
                <RefreshCw size={11} />
                Swap Piece
              </button>
            )}

            {piece?.retailer_url && (
              <a
                data-testid={`link-modal-retailer-${id}`}
                href={piece.retailer_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAffiliateClick({ pieceId: piece.id, retailer: piece.retailer, lookSlug: lookSlug || "direct" })}
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
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--stone)"; e.currentTarget.style.background = "var(--cream)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--sand)"; e.currentTarget.style.background = "transparent"; }}
              >
                View at {piece.retailer}
                <ExternalLink size={11} />
              </a>
            )}

            {isSavedItemMode && onRemoveSavedItem && savedItem && (
              <button
                data-testid={`button-modal-remove-saved-${id}`}
                onClick={() => { onRemoveSavedItem(savedItem.pieceId); onClose(); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  width: "100%",
                  padding: "9px 16px",
                  border: "1px solid var(--sand)",
                  background: "transparent",
                  color: "var(--stone)",
                  fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--charcoal)"; e.currentTarget.style.borderColor = "var(--stone)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--stone)"; e.currentTarget.style.borderColor = "var(--sand)"; }}
              >
                <X size={11} />
                Remove from Saved
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
