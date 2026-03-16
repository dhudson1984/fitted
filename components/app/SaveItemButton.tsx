"use client";

import { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import AuthPromptModal from "./AuthPromptModal";
import type { Piece } from "@/lib/types";

interface SaveItemButtonProps {
  piece: Piece;
}

export default function SaveItemButton({ piece }: SaveItemButtonProps) {
  const [saved, setSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
    };
  }, []);

  useEffect(() => {
    try {
      const name = localStorage.getItem("userName");
      setIsAuthenticated(!!name && name.trim().length > 0);
    } catch {}

    try {
      const items = JSON.parse(localStorage.getItem("fitted_saved_items") || "[]");
      if (items.some((i: { pieceId: string }) => i.pieceId === piece.id)) {
        setSaved(true);
      }
    } catch {}
  }, [piece.id]);

  const handleSave = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const items = JSON.parse(localStorage.getItem("fitted_saved_items") || "[]");
    if (saved) {
      const updated = items.filter((i: { pieceId: string }) => i.pieceId !== piece.id);
      localStorage.setItem("fitted_saved_items", JSON.stringify(updated));
      setSaved(false);
    } else {
      items.push({
        pieceId: piece.id,
        brand: piece.brand,
        name: piece.name,
        price: piece.price,
        priceStr: piece.price_display,
        savedAt: new Date().toISOString(),
      });
      localStorage.setItem("fitted_saved_items", JSON.stringify(items));
      setSaved(true);
      setShowConfirm(true);
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      confirmTimer.current = setTimeout(() => setShowConfirm(false), 2000);
    }
  };

  return (
    <>
      <button
        data-testid={`button-save-item-${piece.id}`}
        onClick={handleSave}
        title={saved ? "Remove from saved" : "Save this piece"}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: saved ? "var(--bark)" : "var(--stone)",
          transition: "color 0.2s",
          padding: "4px 0",
          display: "flex",
          alignItems: "center",
          gap: 5,
          position: "relative",
        }}
        onMouseEnter={(e) => {
          if (!saved) e.currentTarget.style.color = "var(--charcoal)";
        }}
        onMouseLeave={(e) => {
          if (!saved) e.currentTarget.style.color = "var(--stone)";
        }}
      >
        <Heart size={14} fill={saved ? "currentColor" : "none"} />
        <span
          style={{
            fontSize: 10,
            fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {saved ? "Saved" : "Save Item"}
        </span>
      </button>

      {showConfirm && (
        <div
          data-testid={`toast-saved-${piece.id}`}
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--charcoal)",
            color: "var(--cream)",
            padding: "10px 20px",
            fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.06em",
            zIndex: 9999,
            animation: "fadeUp 0.3s ease-out",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Heart size={12} fill="currentColor" />
          Item saved
        </div>
      )}

      <AuthPromptModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
