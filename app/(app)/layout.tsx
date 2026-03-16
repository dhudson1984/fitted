"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import MobileMenuDrawer from "@/components/MobileMenuDrawer";
import BagDrawer from "@/components/BagDrawer";
import { ToastProvider } from "@/components/Toast";
import { BagProvider, useBag } from "@/components/providers/BagProvider";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
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
  }, []);

  const handleSignOut = useCallback(() => {
    try {
      localStorage.removeItem("userName");
      localStorage.removeItem("fitted_survey");
      localStorage.removeItem("fitted_saved_looks");
      localStorage.removeItem("fitted_saved_items");
      localStorage.removeItem("fitted_builds");
      localStorage.removeItem("fitted_has_seen_welcome");
    } catch {}
    document.cookie = "fitted_survey_completed=; path=/; max-age=0";
    router.push("/");
  }, [router]);

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
