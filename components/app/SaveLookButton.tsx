"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import AuthPromptModal from "./AuthPromptModal";

interface SaveLookButtonProps {
  lookSlug: string;
  lookName: string;
}

export default function SaveLookButton({ lookSlug, lookName }: SaveLookButtonProps) {
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
      const savedLooks = JSON.parse(localStorage.getItem("fitted_saved_looks") || "[]");
      if (savedLooks.includes(lookSlug)) {
        setSaved(true);
      }
    } catch {}
  }, [lookSlug]);

  const handleSave = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const savedLooks = JSON.parse(localStorage.getItem("fitted_saved_looks") || "[]");
    if (saved) {
      const updated = savedLooks.filter((s: string) => s !== lookSlug);
      localStorage.setItem("fitted_saved_looks", JSON.stringify(updated));
      setSaved(false);
    } else {
      savedLooks.push(lookSlug);
      localStorage.setItem("fitted_saved_looks", JSON.stringify(savedLooks));
      setSaved(true);
    }
  };

  return (
    <>
      <button
        data-testid={`button-save-look-${lookSlug}`}
        onClick={handleSave}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: "13px 16px",
          background: saved ? "var(--cream)" : "transparent",
          color: saved ? "var(--bark)" : "var(--charcoal)",
          border: `1.5px solid ${saved ? "var(--bark)" : "var(--sand)"}`,
          fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!saved) {
            e.currentTarget.style.borderColor = "var(--stone)";
            e.currentTarget.style.background = "var(--cream)";
          }
        }}
        onMouseLeave={(e) => {
          if (!saved) {
            e.currentTarget.style.borderColor = "var(--sand)";
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        <Heart size={14} fill={saved ? "currentColor" : "none"} />
        {saved ? "Saved" : "Save This Look"}
      </button>
      <AuthPromptModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
