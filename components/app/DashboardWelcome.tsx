"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";

export default function DashboardWelcome() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const survey = localStorage.getItem("fitted_survey");
      const seen = localStorage.getItem("fitted_has_seen_welcome");
      if (survey && !seen) {
        setVisible(true);
      }
    } catch {}
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem("fitted_has_seen_welcome", "true");
    } catch {}
  }

  if (!visible) return null;

  return (
    <div
      data-testid="welcome-overlay"
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(26,26,24,0.55)" }}
    >
      <div
        data-testid="welcome-card"
        className="relative w-full max-w-md mx-4"
        style={{
          background: "var(--warm-white)",
          padding: "48px 36px 40px",
          animation: "fadeUp 0.5s ease-out",
          borderRadius: 6,
        }}
      >
        <button
          data-testid="button-welcome-close"
          onClick={dismiss}
          className="absolute top-4 right-4 bg-transparent border-none cursor-pointer"
          style={{ color: "var(--muted)" }}
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} style={{ color: "var(--bark)" }} />
          <span
            className="text-[10px] font-medium tracking-[0.18em] uppercase"
            style={{ color: "var(--bark)" }}
          >
            Style Profile Complete
          </span>
        </div>

        <h2
          data-testid="text-welcome-title"
          className="font-display text-3xl font-light mb-3"
          style={{ color: "var(--charcoal)" }}
        >
          Your style profile is ready
        </h2>

        <p
          data-testid="text-welcome-subtitle"
          className="text-sm font-light leading-relaxed mb-8"
          style={{ color: "var(--muted)" }}
        >
          We&apos;ve curated looks based on your preferences. Explore what we&apos;ve picked for you, or start building your own.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/explore"
            data-testid="link-welcome-explore"
            onClick={dismiss}
            className="no-underline px-6 py-3 text-[11px] font-medium tracking-[0.12em] uppercase cursor-pointer transition-colors"
            style={{
              background: "var(--charcoal)",
              color: "var(--cream)",
            }}
          >
            Explore Looks
          </Link>
          <Link
            href="/build"
            data-testid="link-welcome-build"
            onClick={dismiss}
            className="no-underline px-6 py-3 text-[11px] font-medium tracking-[0.12em] uppercase cursor-pointer transition-colors"
            style={{
              background: "transparent",
              color: "var(--charcoal)",
              border: "1.5px solid var(--sand)",
            }}
          >
            Build a Look
          </Link>
        </div>
      </div>
    </div>
  );
}
