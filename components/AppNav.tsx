"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, ArrowLeft, User, Heart, LogOut } from "lucide-react";

interface AppNavProps {
  bagCount?: number;
  onHamburgerClick?: () => void;
  onBagClick?: () => void;
  onSignOut?: () => void;
  userName?: string;
  userEmail?: string;
  userInitial?: string;
}

const BREADCRUMB_MAP: Record<string, { back: string; backLabel: string; crumb: string }> = {
  "/explore": { back: "/dashboard", backLabel: "Dashboard", crumb: "Explore" },
  "/build": { back: "/dashboard", backLabel: "Dashboard", crumb: "Build a Look" },
  "/profile": { back: "/dashboard", backLabel: "Dashboard", crumb: "Profile" },
  "/looks": { back: "/explore", backLabel: "Explore", crumb: "Look Detail" },
  "/lookboard": { back: "/dashboard", backLabel: "Dashboard", crumb: "Lookboard" },
};

export default function AppNav({
  bagCount = 0,
  onHamburgerClick,
  onBagClick,
  onSignOut,
  userName = "David",
  userEmail = "david@email.com",
  userInitial = "D",
}: AppNavProps) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const breadcrumb = Object.entries(BREADCRUMB_MAP).find(([prefix]) =>
    pathname.startsWith(prefix)
  )?.[1];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  return (
    <nav
      data-testid="app-nav"
      className="fixed top-0 left-0 right-0 z-[100] flex items-center gap-4 px-10 max-md:px-4 max-md:gap-2.5"
      style={{
        height: "var(--nav-h)",
        background: "rgba(250,247,242,0.94)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(196,184,154,0.25)",
      }}
    >
      <button
        data-testid="button-hamburger"
        className="hidden max-md:flex flex-col justify-center gap-[5px] w-9 h-9 bg-transparent border-none cursor-pointer p-1.5 shrink-0"
        onClick={onHamburgerClick}
        aria-label="Menu"
      >
        <span className="block h-[1.5px] bg-charcoal transition-all origin-center" />
        <span className="block h-[1.5px] bg-charcoal transition-all origin-center" />
        <span className="block h-[1.5px] bg-charcoal transition-all origin-center" />
      </button>

      <Link
        href="/dashboard"
        data-testid="link-logo"
        className="font-display text-[20px] font-normal tracking-[0.15em] uppercase text-charcoal no-underline cursor-pointer shrink-0"
      >
        Fitted
      </Link>

      {breadcrumb && (
        <>
          <Link
            href={breadcrumb.back}
            data-testid="button-back"
            className="flex items-center gap-[7px] text-[12px] max-md:text-[11px] max-md:gap-[5px] tracking-[0.08em] uppercase text-muted hover:text-charcoal transition-colors font-body no-underline"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>{breadcrumb.backLabel}</span>
          </Link>
          <span className="text-sand text-sm" data-testid="text-nav-separator">/</span>
          <span
            className="text-[12px] tracking-[0.08em] uppercase text-charcoal"
            data-testid="text-nav-crumb"
          >
            {breadcrumb.crumb}
          </span>
        </>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-4 ml-auto">
        <button
          data-testid="button-bag"
          className="w-9 h-9 flex items-center justify-center cursor-pointer text-charcoal hover:text-bark transition-colors relative bg-transparent border-none"
          onClick={onBagClick}
          aria-label="Open bag"
        >
          <ShoppingBag className="w-[17px] h-[17px]" />
          {bagCount > 0 && (
            <span
              data-testid="text-bag-count"
              className="absolute top-[2px] right-[2px] min-w-[16px] h-4 rounded-full bg-bark text-cream text-[9px] font-medium flex items-center justify-center px-1 font-body"
            >
              {bagCount}
            </span>
          )}
        </button>

        <div className="relative max-md:hidden" ref={profileRef}>
          <button
            data-testid="button-profile-avatar"
            className="w-[34px] h-[34px] rounded-full bg-charcoal hover:bg-bark flex items-center justify-center text-[13px] font-medium text-cream cursor-pointer border-none font-body transition-colors"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-label="Profile menu"
          >
            {userInitial}
          </button>

          <div
            data-testid="dropdown-profile-menu"
            className="absolute top-[calc(100%+10px)] right-0 w-[210px] bg-warm-white border border-sand z-[500] transition-all duration-200"
            style={{
              boxShadow: "0 8px 32px rgba(26,26,24,0.12)",
              opacity: profileOpen ? 1 : 0,
              pointerEvents: profileOpen ? "all" : "none",
              transform: profileOpen ? "translateY(0)" : "translateY(-6px)",
            }}
          >
            <div className="px-4 pt-3.5 pb-2.5 border-b border-sand">
              <div className="text-sm font-normal text-charcoal" data-testid="text-profile-name">
                {userName}
              </div>
              <div className="text-[11px] font-light text-muted mt-px" data-testid="text-profile-email">
                {userEmail}
              </div>
            </div>

            <Link
              href="/profile"
              data-testid="link-profile-my-profile"
              className="flex items-center gap-2.5 py-[11px] px-4 text-[12px] text-charcoal hover:bg-cream transition-colors no-underline tracking-[0.03em] font-body"
              onClick={() => setProfileOpen(false)}
            >
              <User className="w-3 h-3 opacity-60" />
              My Profile
            </Link>
            <button
              data-testid="button-profile-my-bag"
              className="flex items-center gap-2.5 py-[11px] px-4 text-[12px] text-charcoal hover:bg-cream transition-colors w-full text-left font-body bg-transparent border-none cursor-pointer tracking-[0.03em]"
              onClick={() => {
                setProfileOpen(false);
                onBagClick?.();
              }}
            >
              <ShoppingBag className="w-3 h-3 opacity-60" />
              My Bag
            </button>
            <Link
              href="/dashboard"
              data-testid="link-profile-my-lookboard"
              className="flex items-center gap-2.5 py-[11px] px-4 text-[12px] text-charcoal hover:bg-cream transition-colors no-underline tracking-[0.03em] font-body"
              onClick={() => setProfileOpen(false)}
            >
              <Heart className="w-3 h-3 opacity-60" />
              My Lookboard
            </Link>

            <div className="h-px bg-sand" />

            <button
              data-testid="button-profile-sign-out"
              className="flex items-center gap-2.5 py-[11px] px-4 text-[12px] text-[#8B4A2A] hover:bg-[#fdf5f0] transition-colors w-full text-left font-body bg-transparent border-none cursor-pointer tracking-[0.03em]"
              onClick={() => {
                setProfileOpen(false);
                onSignOut?.();
              }}
            >
              <LogOut className="w-3 h-3 opacity-60" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
