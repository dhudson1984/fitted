"use client";

import { useState, useEffect } from "react";
import SaveProfileModal from "@/components/auth/SaveProfileModal";

const DISMISSED_KEY = "fitted_save_banner_dismissed";

export default function DashboardSaveBanner() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        if (localStorage.getItem(DISMISSED_KEY)) return;
        const survey = localStorage.getItem("fitted_survey");
        if (!survey) return;
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase.auth.getSession();
        if (!data.session) setVisible(true);
      } catch {}
    }
    check();
  }, []);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(DISMISSED_KEY, "true"); } catch {}
  }

  function handleModalDone() {
    setModalOpen(false);
    setVisible(false);
    try { localStorage.setItem(DISMISSED_KEY, "true"); } catch {}
  }

  if (!visible) return null;

  return (
    <>
      <div
        data-testid="banner-save-profile"
        style={{
          background: "var(--cream)",
          border: "1.5px solid var(--sand)",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 28,
          flexWrap: "wrap",
        }}
      >
        <p
          className="font-body"
          style={{ fontSize: 13, color: "var(--charcoal)", fontWeight: 300, lineHeight: 1.5, flex: 1, margin: 0 }}
        >
          Your profile isn&apos;t saved yet — create a password to access your looks from any device.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <button
            data-testid="button-banner-save"
            onClick={() => setModalOpen(true)}
            className="font-body"
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 500,
              color: "var(--cream)",
              background: "var(--charcoal)",
              border: "none",
              padding: "9px 18px",
              cursor: "pointer",
              transition: "background 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bark)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--charcoal)")}
          >
            Save Profile
          </button>
          <button
            data-testid="button-banner-dismiss"
            onClick={dismiss}
            aria-label="Dismiss"
            style={{
              fontSize: 20,
              lineHeight: 1,
              color: "var(--stone)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 4px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--stone)")}
          >
            &times;
          </button>
        </div>
      </div>
      <SaveProfileModal isOpen={modalOpen} email="" onDone={handleModalDone} />
    </>
  );
}
