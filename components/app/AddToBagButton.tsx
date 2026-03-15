"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useBag } from "@/components/providers/BagProvider";
import { supabase } from "@/lib/supabase";
import AuthPromptModal from "./AuthPromptModal";
import type { Piece } from "@/lib/types";

interface AddToBagButtonProps {
  piece: Piece;
  lookName: string;
}

export default function AddToBagButton({ piece, lookName }: AddToBagButtonProps) {
  const { addItem, items } = useBag();
  const isInBag = items.some((i) => i.id === piece.id);
  const [justAdded, setJustAdded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    try {
      const survey = localStorage.getItem("fitted_survey");
      if (survey) setIsAuthenticated(true);
    } catch {}
  }, []);

  const handleAdd = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (isInBag) return;
    addItem({
      id: piece.id,
      brand: piece.brand,
      name: piece.name,
      price: piece.price,
      priceStr: piece.price_display,
      retailer: piece.retailer,
      look: lookName,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const added = isInBag || justAdded;

  return (
    <>
      <button
        data-testid={`button-add-to-bag-${piece.id}`}
        onClick={handleAdd}
        disabled={added}
        style={{
          width: "100%",
          padding: "11px 16px",
          background: added ? "var(--stone)" : "var(--charcoal)",
          color: "var(--cream)",
          border: "none",
          fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          cursor: added ? "default" : "pointer",
          transition: "background 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: added ? 0.8 : 1,
        }}
        onMouseEnter={(e) => {
          if (!added) e.currentTarget.style.background = "var(--bark)";
        }}
        onMouseLeave={(e) => {
          if (!added) e.currentTarget.style.background = "var(--charcoal)";
        }}
      >
        {added ? (
          <>
            <Check size={14} />
            In Bag
          </>
        ) : (
          <>
            <ShoppingBag size={14} />
            Add to Bag
          </>
        )}
      </button>
      <AuthPromptModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
