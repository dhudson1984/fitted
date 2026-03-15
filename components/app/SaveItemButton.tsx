"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import AuthPromptModal from "./AuthPromptModal";
import type { Piece } from "@/lib/types";

interface SaveItemButtonProps {
  piece: Piece;
}

export default function SaveItemButton({ piece }: SaveItemButtonProps) {
  const [saved, setSaved] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    try {
      const survey = localStorage.getItem("fitted_survey");
      setIsAuthenticated(!!survey);
    } catch {
      setIsAuthenticated(false);
    }

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
          padding: 4,
          display: "flex",
          alignItems: "center",
        }}
        onMouseEnter={(e) => {
          if (!saved) e.currentTarget.style.color = "var(--charcoal)";
        }}
        onMouseLeave={(e) => {
          if (!saved) e.currentTarget.style.color = "var(--stone)";
        }}
      >
        <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
      </button>
      <AuthPromptModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
