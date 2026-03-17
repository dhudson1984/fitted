"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Diamond,
  Triangle,
  Heart,
  User,
  ShoppingBag,
  ArrowRight,
  X,
} from "lucide-react";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bagCount?: number;
  onOpenBag?: () => void;
  onSignOut?: () => void;
}

const menuItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explore", href: "/explore", icon: Diamond },
  { label: "Build a Look", href: "/build", icon: Triangle },
  { label: "Saved", href: "/dashboard#saved", icon: Heart },
  { label: "Profile", href: "/profile", icon: User },
];

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  bagCount = 0,
  onOpenBag,
  onSignOut,
}: MobileMenuDrawerProps) {
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

  return (
    <div
      className={`fixed inset-0 z-[600] flex ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      data-testid="mobile-menu-panel"
    >
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "rgba(26,26,24,0.55)" }}
        onClick={onClose}
        data-testid="mobile-menu-overlay"
      />

      <div
        className={`absolute top-0 left-0 bottom-0 w-[280px] flex flex-col transition-transform duration-[380ms] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--warm-white)",
          transitionTimingFunction: "cubic-bezier(0.32,0,0.15,1)",
        }}
        data-testid="mobile-menu-drawer"
      >
        <div
          className="flex items-center justify-between px-6 shrink-0 border-b border-sand"
          style={{ height: "var(--nav-h)" }}
        >
          <span
            className="font-display text-[20px] font-normal tracking-[0.15em] uppercase"
            data-testid="text-mobile-menu-logo"
          >
            Fitted
          </span>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-[18px] cursor-pointer text-muted transition-colors duration-200 hover:text-charcoal"
            aria-label="Close menu"
            data-testid="button-mobile-menu-close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 w-full py-[14px] px-6 font-body text-[14px] text-charcoal no-underline tracking-[0.02em] transition-colors duration-150 hover:bg-cream"
              data-testid={`link-mobile-menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <span className="w-4 text-center shrink-0 opacity-60">
                <item.icon size={14} />
              </span>
              {item.label}
            </Link>
          ))}

          <div className="h-px bg-sand my-2" />

          <button
            onClick={() => {
              onClose();
              onOpenBag?.();
            }}
            className="flex items-center gap-3 w-full py-[14px] px-6 bg-transparent border-none font-body text-[14px] text-charcoal cursor-pointer text-left tracking-[0.02em] transition-colors duration-150 hover:bg-cream"
            data-testid="button-mobile-menu-bag"
          >
            <span className="w-4 text-center shrink-0 opacity-60">
              <ShoppingBag size={14} />
            </span>
            My Bag
            {bagCount > 0 && (
              <span
                className="ml-1 text-[11px] font-medium text-bark"
                data-testid="text-mobile-bag-count"
              >
                ({bagCount})
              </span>
            )}
          </button>

          <div className="h-px bg-sand my-2" />

          <button
            onClick={() => {
              onClose();
              onSignOut?.();
            }}
            className="flex items-center gap-3 w-full py-[14px] px-6 bg-transparent border-none font-body text-[14px] cursor-pointer text-left tracking-[0.02em] transition-colors duration-150 hover:bg-cream"
            style={{ color: "#8B4A2A" }}
            data-testid="button-mobile-menu-signout"
          >
            <span className="w-4 text-center shrink-0 opacity-60">
              <ArrowRight size={14} />
            </span>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
