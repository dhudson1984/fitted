"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthPromptModal({ isOpen, onClose }: AuthPromptModalProps) {
  const router = useRouter();

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

  if (!isOpen) return null;

  return (
    <div
      data-testid="auth-prompt-modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        data-testid="auth-prompt-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(26,26,24,0.55)",
          animation: "fadeIn 0.25s ease",
        }}
        onClick={onClose}
      />

      <div
        data-testid="auth-prompt-content"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          background: "var(--warm-white)",
          padding: "48px 40px 40px",
          textAlign: "center",
          animation: "fadeUp 0.35s ease",
        }}
      >
        <button
          data-testid="button-auth-prompt-close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--muted)",
            transition: "color 0.2s",
          }}
          aria-label="Close"
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          <X size={18} />
        </button>

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1.5px solid var(--sand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 22,
              fontWeight: 300,
              color: "var(--bark)",
            }}
          >
            F
          </span>
        </div>

        <h2
          data-testid="text-auth-prompt-title"
          style={{
            fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
            fontSize: 28,
            fontWeight: 300,
            color: "var(--charcoal)",
            lineHeight: 1.2,
            marginBottom: 12,
          }}
        >
          Join Fitted to save your style
        </h2>

        <p
          data-testid="text-auth-prompt-body"
          style={{
            fontSize: 14,
            fontWeight: 300,
            color: "var(--muted)",
            lineHeight: 1.7,
            marginBottom: 32,
            maxWidth: 320,
            margin: "0 auto 32px",
          }}
        >
          To save looks and build your bag, we need a little more information
          about your style. It only takes 3 minutes.
        </p>

        <button
          data-testid="button-begin-survey"
          onClick={() => router.push("/onboarding")}
          style={{
            width: "100%",
            padding: "15px 32px",
            background: "var(--charcoal)",
            color: "var(--cream)",
            border: "none",
            fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 0.2s",
            marginBottom: 12,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bark)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--charcoal)")}
        >
          Begin Survey
        </button>

        <button
          data-testid="button-maybe-later"
          onClick={onClose}
          style={{
            width: "100%",
            padding: "13px 32px",
            background: "transparent",
            color: "var(--muted)",
            border: "1.5px solid var(--sand)",
            fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--stone)";
            e.currentTarget.style.color = "var(--charcoal)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--sand)";
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
