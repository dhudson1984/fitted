"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import MobileMenuDrawer from "@/components/MobileMenuDrawer";
import BagDrawer from "@/components/BagDrawer";
import { ToastProvider } from "@/components/Toast";
import { BagProvider, useBag } from "@/components/providers/BagProvider";
import { supabase } from "@/lib/supabase";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const { items, removeItem, itemCount } = useBag();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/");
  }, [router]);

  return (
    <>
      <AppNav
        bagCount={itemCount}
        onHamburgerClick={() => setMobileMenuOpen(true)}
        onBagClick={() => setBagOpen(true)}
        onSignOut={handleSignOut}
      />
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
