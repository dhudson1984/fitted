"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, ShoppingBag, Heart, User } from "lucide-react";

interface MobileBottomNavProps {
  onBagClick?: () => void;
  bagCount?: number;
}

export default function MobileBottomNav({ onBagClick, bagCount = 0 }: MobileBottomNavProps) {
  const pathname = usePathname();

  function activeColor(active: boolean) {
    return active ? "var(--bark)" : "var(--charcoal)";
  }

  const homeActive = pathname === "/dashboard";
  const exploreActive = pathname.startsWith("/explore");
  const savedActive = pathname === "/lookboard";
  const profileActive = pathname === "/profile";

  return (
    <nav
      data-testid="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-[200] flex items-stretch"
      style={{
        height: 60,
        background: "var(--cream)",
        borderTop: "1px solid var(--sand)",
      }}
    >
      <Link
        href="/dashboard"
        data-testid="mobile-nav-home"
        className="flex flex-col items-center justify-center flex-1 no-underline gap-[3px]"
        style={{ color: activeColor(homeActive) }}
        aria-label="Home"
      >
        <Home className="w-[20px] h-[20px]" />
        <span className="font-body text-[9px] tracking-[0.08em] uppercase">Home</span>
      </Link>

      <Link
        href="/explore"
        data-testid="mobile-nav-explore"
        className="flex flex-col items-center justify-center flex-1 no-underline gap-[3px]"
        style={{ color: activeColor(exploreActive) }}
        aria-label="Explore"
      >
        <Compass className="w-[20px] h-[20px]" />
        <span className="font-body text-[9px] tracking-[0.08em] uppercase">Explore</span>
      </Link>

      <button
        data-testid="mobile-nav-bag"
        onClick={onBagClick}
        className="flex flex-col items-center justify-center flex-1 bg-transparent border-none cursor-pointer gap-[3px]"
        style={{ color: activeColor(false) }}
        aria-label="Open bag"
      >
        <div className="relative">
          <ShoppingBag className="w-[20px] h-[20px]" />
          {bagCount > 0 && (
            <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] rounded-full bg-bark text-cream text-[8px] font-medium flex items-center justify-center px-0.5 font-body">
              {bagCount}
            </span>
          )}
        </div>
        <span className="font-body text-[9px] tracking-[0.08em] uppercase">Bag</span>
      </button>

      <Link
        href="/lookboard"
        data-testid="mobile-nav-saved"
        className="flex flex-col items-center justify-center flex-1 no-underline gap-[3px]"
        style={{ color: activeColor(savedActive) }}
        aria-label="Saved looks"
      >
        <Heart className="w-[20px] h-[20px]" />
        <span className="font-body text-[9px] tracking-[0.08em] uppercase">Saved</span>
      </Link>

      <Link
        href="/profile"
        data-testid="mobile-nav-profile"
        className="flex flex-col items-center justify-center flex-1 no-underline gap-[3px]"
        style={{ color: activeColor(profileActive) }}
        aria-label="Profile"
      >
        <User className="w-[20px] h-[20px]" />
        <span className="font-body text-[9px] tracking-[0.08em] uppercase">Profile</span>
      </Link>
    </nav>
  );
}
