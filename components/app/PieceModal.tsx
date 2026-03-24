"use client";

import { useEffect, useState, useRef } from "react";
import { X, RefreshCw, ExternalLink, ShoppingBag, Check, Heart } from "lucide-react";
import type { Piece } from "@/lib/types";
import { trackAffiliateClick } from "@/lib/analytics";
import { useBag } from "@/components/providers/BagProvider";
import AuthPromptModal from "./AuthPromptModal";

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

const GHOST: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  padding: "7px 14px",
  border: "1px solid var(--sand)",
  background: "transparent",
  color: "var(--stone)",
  fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  cursor: "pointer",
  transition: "all 0.2s",
  textDecoration: "none",
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
        ...GHOST,
        color: isInBag ? "var(--stone)" : "var(--charcoal)",
        opacity: isInBag ? 0.6 : 1,
        cursor: isInBag ? "default" : "pointer",
        width: "100%",
      }}
      onMouseEnter={(e) => { if (!isInBag) { e.currentTarget.style.borderColor = "var(--stone)"; e.currentTarget.style.color = "var(--charcoal)"; } }}
      onMouseLeave={(e) => { if (!isInBag) { e.currentTarget.style.borderColor = "var(--sand)"; e.currentTarget.style.color = "var(--stone)"; } }}
    >
      {isInBag ? <><Check size={12} /> In Bag</> : <><ShoppingBag size={12} /> Add to Bag</>}
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
  const { addItem, items } = useBag();
  const [justAdded, setJustAdded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const name = localStorage.getItem("userName");
      const authed = !!name && name.trim().length > 0;
      setIsAuthenticated(authed);
      if (authed && piece) {
        const saved = JSON.parse(localStorage.getItem("fitted_saved_items") || "[]");
        setIsSaved(saved.some((i: { pieceId: string }) => i.pieceId === piece.id));
      }
    } catch {}
  }, [piece?.id]);

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

  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

  if (!isOpen) return null;

  const isSavedItemMode = !piece && !!savedItem;
  const id = piece?.id ?? savedItem?.pieceId ?? "";
  const brand = piece?.brand ?? savedItem?.brand ?? "";
  const name = piece?.name ?? savedItem?.name ?? "";
  const priceStr = piece?.price_display ?? savedItem?.priceStr ?? "";
  const slotLabel = piece ? (SLOT_LABELS[piece.slot_type] || piece.slot_type) : null;
  const isInBag = piece ? items.some((i) => i.id === piece.id) || justAdded : false;

  const handleAddToBag = () => {
    if (!isAuthenticated) { setShowAuthModal(true); return; }
    if (!piece || isInBag) return;
    addItem({
      id: piece.id,
      brand: piece.brand,
      name: piece.name,
      price: piece.price,
      priceStr: piece.price_display,
      retailer: piece.retailer,
      look: lookName ?? "",
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleSave = () => {
    if (!isAuthenticated) { setShowAuthModal(true); return; }
    if (!piece) return;
    const saved = JSON.parse(localStorage.getItem("fitted_saved_items") || "[]");
    if (isSaved) {
      const updated = saved.filter((i: { pieceId: string }) => i.pieceId !== piece.id);
      localStorage.setItem("fitted_saved_items", JSON.stringify(updated));
      setIsSaved(false);
    } else {
      saved.push({ pieceId: piece.id, brand: piece.brand, name: piece.name, price: piece.price, priceStr: piece.price_display, savedAt: new Date().toISOString() });
      localStorage.setItem("fitted_saved_items", JSON.stringify(saved));
      setIsSaved(true);
    }
  };

  return (
    <>
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
          maxWidth: 680,
          maxHeight: "88vh",
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
            background: "rgba(250,247,242,0.85)",
            border: "none",
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--charcoal)",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cream)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(250,247,242,0.85)")}
        >
          <X size={15} />
        </button>

        <div
          style={{
            width: 280,
            flexShrink: 0,
            background: "var(--cream)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            alignSelf: "stretch",
            minHeight: 360,
            overflow: "hidden",
          }}
          className="max-md:!w-full max-md:!min-h-[200px]"
        >
          {piece?.image_url ? (
            <img
              data-testid={`img-modal-piece-${id}`}
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
                  position: "absolute",
                  top: 16,
                  left: 16,
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--stone)",
                  fontWeight: 500,
                  fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                }}
              >
                {slotLabel ?? "Piece"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "0 24px" }}>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
                    fontSize: 36,
                    fontWeight: 300,
                    color: "var(--charcoal)",
                    textAlign: "center",
                    lineHeight: 1.1,
                  }}
                >
                  {brand}
                </div>
                {piece?.color && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--stone)",
                      letterSpacing: "0.1em",
                      fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                      textTransform: "uppercase",
                    }}
                  >
                    {piece.color}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div
          style={{
            flex: 1,
            padding: "32px 26px 24px",
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
              marginBottom: 5,
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
              marginBottom: 8,
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
              marginBottom: 14,
            }}
          >
            {priceStr}
          </div>

          {piece && (piece.color || piece.material || piece.fit_type) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
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

          <div style={{ height: 1, background: "var(--sand)", marginBottom: 16 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {piece && lookName && (
              <button
                data-testid={`button-add-to-bag-${id}`}
                onClick={handleAddToBag}
                disabled={isInBag}
                style={{
                  ...GHOST,
                  width: "100%",
                  color: isInBag ? "var(--stone)" : "var(--charcoal)",
                  borderColor: isInBag ? "var(--sand)" : "var(--sand)",
                  opacity: isInBag ? 0.65 : 1,
                  cursor: isInBag ? "default" : "pointer",
                }}
                onMouseEnter={(e) => { if (!isInBag) { e.currentTarget.style.borderColor = "var(--stone)"; e.currentTarget.style.color = "var(--charcoal)"; } }}
                onMouseLeave={(e) => { if (!isInBag) { e.currentTarget.style.borderColor = "var(--sand)"; e.currentTarget.style.color = "var(--stone)"; } }}
              >
                {isInBag ? <><Check size={12} /> In Bag</> : <><ShoppingBag size={12} /> Add to Bag</>}
              </button>
            )}

            {isSavedItemMode && savedItem && <SavedItemBagButton savedItem={savedItem} />}

            {piece && (
              <button
                data-testid={`button-save-item-${id}`}
                onClick={handleSave}
                style={{
                  ...GHOST,
                  width: "100%",
                  color: isSaved ? "var(--bark)" : "var(--stone)",
                  borderColor: isSaved ? "var(--bark)" : "var(--sand)",
                }}
                onMouseEnter={(e) => { if (!isSaved) { e.currentTarget.style.borderColor = "var(--stone)"; e.currentTarget.style.color = "var(--charcoal)"; } }}
                onMouseLeave={(e) => { if (!isSaved) { e.currentTarget.style.borderColor = "var(--sand)"; e.currentTarget.style.color = "var(--stone)"; } }}
              >
                <Heart size={12} fill={isSaved ? "currentColor" : "none"} />
                {isSaved ? "Saved" : "Save Item"}
              </button>
            )}

            {piece && onSwap && (
              <button
                data-testid={`button-modal-swap-${id}`}
                onClick={() => { onSwap(piece); onClose(); }}
                style={{ ...GHOST, width: "100%" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--stone)"; e.currentTarget.style.color = "var(--charcoal)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--sand)"; e.currentTarget.style.color = "var(--stone)"; }}
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
                style={{ ...GHOST, color: "var(--bark)", borderColor: "var(--sand)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--stone)"; e.currentTarget.style.color = "var(--bark)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--sand)"; }}
              >
                View at {piece.retailer}
                <ExternalLink size={11} />
              </a>
            )}

            {isSavedItemMode && onRemoveSavedItem && savedItem && (
              <button
                data-testid={`button-modal-remove-saved-${id}`}
                onClick={() => { onRemoveSavedItem(savedItem.pieceId); onClose(); }}
                style={{ ...GHOST, width: "100%" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--stone)"; e.currentTarget.style.color = "var(--charcoal)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--sand)"; e.currentTarget.style.color = "var(--stone)"; }}
              >
                <X size={11} />
                Remove from Saved
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

    <AuthPromptModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
