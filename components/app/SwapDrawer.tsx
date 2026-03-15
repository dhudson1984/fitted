"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ShoppingBag, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useBag } from "@/components/providers/BagProvider";
import AuthPromptModal from "./AuthPromptModal";
import type { Piece } from "@/lib/types";

interface SwapDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPiece: (Piece & { sort_order: number }) | null;
  lookName: string;
  onSwap?: (oldPieceId: string, newPiece: Piece) => void;
}

export default function SwapDrawer({ isOpen, onClose, currentPiece, lookName, onSwap }: SwapDrawerProps) {
  const [alternatives, setAlternatives] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { addItem, items } = useBag();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    try {
      const survey = localStorage.getItem("fitted_survey");
      if (survey) setIsAuthenticated(true);
    } catch {}
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (!isOpen || !currentPiece) return;
    setLoading(true);
    setSelectedId(null);

    async function fetchAlternatives() {
      const { data, error } = await supabase
        .from("pieces")
        .select("*")
        .eq("slot_type", currentPiece!.slot_type)
        .neq("id", currentPiece!.id)
        .limit(8);

      if (!error && data) {
        setAlternatives(data);
      } else {
        setAlternatives([]);
      }
      setLoading(false);
    }
    fetchAlternatives();
  }, [isOpen, currentPiece]);

  if (!currentPiece) return null;

  const priceDiff = (altPrice: number) => {
    const diff = altPrice - currentPiece.price;
    if (diff === 0) return { label: "Same price", className: "same" };
    if (diff > 0) return { label: `+$${diff.toFixed(0)}`, className: "up" };
    return { label: `-$${Math.abs(diff).toFixed(0)}`, className: "down" };
  };

  const handleSelect = (alt: Piece) => {
    setSelectedId(alt.id);
    onSwap?.(currentPiece.id, alt);
    setTimeout(() => onClose(), 900);
  };

  const handleAddToBag = (alt: Piece) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (items.some((i) => i.id === alt.id)) return;
    addItem({
      id: alt.id,
      brand: alt.brand,
      name: alt.name,
      price: alt.price,
      priceStr: alt.price_display,
      retailer: alt.retailer,
      look: lookName,
    });
  };

  return (
    <div
      data-testid="swap-panel"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 450,
        display: "flex",
        pointerEvents: isOpen ? "all" : "none",
      }}
    >
      <div
        data-testid="swap-overlay"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(26,26,24,0.5)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.35s",
          cursor: "pointer",
        }}
      />

      <div
        data-testid="swap-drawer"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 520,
          background: "var(--warm-white)",
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.32,0,0.15,1)",
        }}
      >
        <div
          style={{
            height: "var(--nav-h)",
            borderBottom: "1px solid var(--sand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              data-testid="text-swap-title"
              style={{
                fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
                fontSize: 20,
                fontWeight: 400,
              }}
            >
              Swap This Piece
            </div>
            <div
              data-testid="text-swap-subtitle"
              style={{ fontSize: 11, fontWeight: 300, color: "var(--muted)" }}
            >
              {loading ? "Finding alternatives..." : `${alternatives.length} alternative${alternatives.length !== 1 ? "s" : ""} found`}
            </div>
          </div>
          <button
            data-testid="button-swap-close"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "var(--muted)",
              transition: "color 0.2s",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            <X size={18} />
          </button>
        </div>

        <div
          data-testid="swap-current"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "20px 28px",
            background: "var(--cream)",
            borderBottom: "1px solid var(--sand)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 48,
              height: 62,
              background: "var(--sand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
              {currentPiece.slot_type}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>
              Currently Selected
            </div>
            <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--bark)", marginBottom: 2 }}>
              {currentPiece.brand}
            </div>
            <div style={{ fontSize: 13, color: "var(--charcoal)", fontWeight: 400, marginBottom: 2 }}>
              {currentPiece.name}
            </div>
            <div style={{ fontSize: 12, fontWeight: 300, color: "var(--muted)" }}>
              {currentPiece.price_display}
            </div>
          </div>
          <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", background: "var(--sand)", padding: "3px 8px", flexShrink: 0 }}>
            Current
          </span>
        </div>

        <div
          style={{ flex: 1, overflowY: "auto" }}
        >
          <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", padding: "20px 28px 12px", borderBottom: "1px solid var(--sand)" }}>
            Alternatives
          </div>

          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, color: "var(--muted)" }}>
              <RefreshCw size={16} style={{ animation: "spin 1s linear infinite", marginRight: 8 }} />
              Loading...
            </div>
          ) : alternatives.length === 0 ? (
            <div style={{ padding: "60px 28px", textAlign: "center", color: "var(--muted)", fontSize: 13, fontWeight: 300 }}>
              No alternatives found for this piece type.
            </div>
          ) : (
            alternatives.map((alt) => {
              const diff = priceDiff(alt.price);
              const isInBag = items.some((i) => i.id === alt.id);
              const isSelected = selectedId === alt.id;

              return (
                <div
                  key={alt.id}
                  data-testid={`swap-alt-${alt.id}`}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: "20px 28px",
                    borderBottom: "1px solid var(--sand)",
                    transition: "background 0.2s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cream)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  <div
                    style={{
                      width: 72,
                      height: 92,
                      background: "var(--cream)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--stone)" }}>
                      {alt.slot_type}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--bark)", marginBottom: 3 }}>
                      {alt.brand}
                    </div>
                    <div style={{ fontSize: 14, color: "var(--charcoal)", fontWeight: 400, marginBottom: 4, lineHeight: 1.3 }}>
                      {alt.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: "var(--charcoal)", fontWeight: 300 }}>
                        {alt.price_display}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 7px",
                          fontWeight: 400,
                          color: diff.className === "up" ? "#8B4A2A" : diff.className === "down" ? "#2A5C3A" : "var(--muted)",
                          background: diff.className === "up" ? "#fdf0ea" : diff.className === "down" ? "#eaf5ee" : "var(--sand)",
                        }}
                      >
                        {diff.label}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                      {alt.color && (
                        <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", background: "var(--sand)", padding: "3px 8px" }}>
                          {alt.color}
                        </span>
                      )}
                      {alt.material && (
                        <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", background: "var(--sand)", padding: "3px 8px" }}>
                          {alt.material}
                        </span>
                      )}
                      {alt.fit_type && (
                        <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", background: "var(--sand)", padding: "3px 8px" }}>
                          {alt.fit_type}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        data-testid={`button-swap-select-${alt.id}`}
                        onClick={() => handleSelect(alt)}
                        style={{
                          padding: "9px 20px",
                          background: isSelected ? "var(--bark)" : "var(--charcoal)",
                          color: "var(--cream)",
                          border: "none",
                          fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                          fontSize: 11,
                          fontWeight: 500,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--bark)"; }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--charcoal)"; }}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </button>
                      <button
                        data-testid={`button-swap-bag-${alt.id}`}
                        onClick={() => handleAddToBag(alt)}
                        disabled={isInBag}
                        style={{
                          padding: "9px 16px",
                          background: "var(--warm-white)",
                          color: "var(--charcoal)",
                          border: "1.5px solid var(--sand)",
                          fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                          fontSize: 11,
                          cursor: isInBag ? "default" : "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          opacity: isInBag ? 0.6 : 1,
                        }}
                        onMouseEnter={(e) => { if (!isInBag) { e.currentTarget.style.borderColor = "var(--stone)"; e.currentTarget.style.background = "var(--cream)"; } }}
                        onMouseLeave={(e) => { if (!isInBag) { e.currentTarget.style.borderColor = "var(--sand)"; e.currentTarget.style.background = "var(--warm-white)"; } }}
                      >
                        <ShoppingBag size={12} />
                        {isInBag ? "In Bag" : "Add to Bag"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <AuthPromptModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
