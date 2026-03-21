"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import MobileMenuDrawer from "@/components/MobileMenuDrawer";
import BagDrawer from "@/components/BagDrawer";
import SaveProfileModal from "@/components/auth/SaveProfileModal";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

import { ToastProvider } from "@/components/Toast";
import { BagProvider, useBag } from "@/components/providers/BagProvider";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [hasSupabaseSession, setHasSupabaseSession] = useState(false);
  const [showSignOutWarning, setShowSignOutWarning] = useState(false);
  const [signOutSaveModalOpen, setSignOutSaveModalOpen] = useState(false);
  const { items, removeItem, itemCount } = useBag();
  const router = useRouter();

  useEffect(() => {
    try {
      const name = localStorage.getItem("userName");
      const authed = !!name && name.trim().length > 0;
      setIsAuthenticated(authed);
      if (authed) {
        setUserName(name!.trim());
        const survey = localStorage.getItem("fitted_survey");
        if (survey) {
          try {
            const parsed = JSON.parse(survey);
            if (parsed.email) setUserEmail(parsed.email);
          } catch {}
        }
      }
    } catch {}

    // Reactively track Supabase session — fires immediately and on every auth change
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setHasSupabaseSession(!!session);
      }
    );

    return () => { subscription.unsubscribe(); };
  }, []);

  const doSignOut = useCallback(() => {
    try {
      localStorage.removeItem("userName");
      localStorage.removeItem("fitted_survey");
      localStorage.removeItem("fitted_saved_looks");
      localStorage.removeItem("fitted_saved_items");
      localStorage.removeItem("fitted_builds");
      localStorage.removeItem("fitted_has_seen_welcome");
      localStorage.removeItem("fitted_bag");
      localStorage.removeItem("fitted_save_banner_dismissed");
      localStorage.removeItem("fitted_member_since");
    } catch {}
    document.cookie = "fitted_survey_completed=; path=/; max-age=0";
    supabase.auth.signOut().catch(() => {});
    router.push("/");
  }, [router]);

  const handleSignOut = useCallback(() => {
    if (!hasSupabaseSession) {
      // Unsaved user — warn before losing their profile
      const survey = localStorage.getItem("fitted_survey");
      if (survey) {
        setShowSignOutWarning(true);
        return;
      }
    }
    doSignOut();
  }, [hasSupabaseSession, doSignOut]);

  const userInitial = userName ? userName.charAt(0).toUpperCase() : "";

  return (
    <>
      <AppNav
        bagCount={isAuthenticated ? itemCount : 0}
        onHamburgerClick={isAuthenticated ? () => setMobileMenuOpen(true) : undefined}
        onBagClick={isAuthenticated ? () => setBagOpen(true) : undefined}
        onSignOut={isAuthenticated ? handleSignOut : undefined}
        userName={userName || undefined}
        userEmail={userEmail || undefined}
        userInitial={userInitial || undefined}
      />
      {isAuthenticated && (
        <MobileMenuDrawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          bagCount={itemCount}
          onOpenBag={() => {
            setMobileMenuOpen(false);
            setBagOpen(true);
          }}
          onSignOut={() => {
            setMobileMenuOpen(false);
            handleSignOut();
          }}
        />
      )}
      {isAuthenticated && (
        <BagDrawer
          isOpen={bagOpen}
          onClose={() => setBagOpen(false)}
          items={items}
          onRemoveItem={removeItem}
          onExploreLooks={() => {
            setBagOpen(false);
            router.push("/explore");
          }}
        />
      )}
      <main style={{ paddingTop: "var(--nav-h)" }}>{children}</main>

      {/* Sign-out warning for users with unsaved survey data */}
      {showSignOutWarning && (
        <div
          data-testid="signout-warning-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(26,26,24,0.55)",
            }}
            onClick={() => setShowSignOutWarning(false)}
          />
          <div
            data-testid="signout-warning-modal"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 420,
              background: "var(--warm-white)",
              padding: "44px 40px 36px",
            }}
          >
            <p
              className="font-body"
              style={{
                fontSize: 9,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--bark)",
                marginBottom: 16,
              }}
            >
              Before You Go
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: 24,
                fontWeight: 300,
                color: "var(--charcoal)",
                lineHeight: 1.2,
                marginBottom: 14,
              }}
            >
              Your style profile will be lost.
            </h2>
            <p
              className="font-body"
              style={{
                fontSize: 13,
                fontWeight: 300,
                color: "var(--muted)",
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              Save your profile first to access your looks from any device.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                data-testid="button-signout-warning-save"
                className="font-body"
                onClick={() => { setShowSignOutWarning(false); setTimeout(() => setSignOutSaveModalOpen(true), 50); }}
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  background: "var(--charcoal)",
                  color: "var(--cream)",
                  border: "none",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bark)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--charcoal)")}
              >
                Save My Profile
              </button>
              <button
                data-testid="button-signout-warning-anyway"
                className="font-body"
                onClick={() => { setShowSignOutWarning(false); doSignOut(); }}
                style={{
                  width: "100%",
                  padding: "13px 24px",
                  background: "transparent",
                  color: "var(--muted)",
                  border: "1.5px solid var(--sand)",
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
                Sign Out Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SaveProfileModal opened from sign-out warning */}
      <SaveProfileModal
        isOpen={signOutSaveModalOpen}
        email=""
        onDone={() => {
          setSignOutSaveModalOpen(false);
          setShowSignOutWarning(false);
        }}
      />
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <BagProvider>
      <ToastProvider>
        <AppShellInner>{children}</AppShellInner>
      </ToastProvider>
    </BagProvider>
  );
}
