"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SignInModal from "@/components/auth/SignInModal";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        data-testid="landing-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 48px",
          background: scrolled ? "rgba(250,247,242,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(196,184,154,0.3)" : "1px solid transparent",
          transition: "background 0.4s, backdrop-filter 0.4s",
        }}
        className="max-md:!px-5 max-md:!py-4"
      >
        <Link
          href="/"
          data-testid="text-landing-logo"
          className="font-display"
          style={{
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: "0.12em",
            color: "var(--charcoal)",
            textTransform: "uppercase",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Fitted
        </Link>

        <ul
          style={{
            display: "flex",
            gap: 40,
            listStyle: "none",
          }}
          className="max-md:!hidden"
        >
          <li>
            <a
              href="#how-it-works"
              data-testid="link-nav-how"
              className="font-body"
              style={{
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: "0.08em",
                color: "var(--charcoal)",
                textDecoration: "none",
                textTransform: "uppercase",
                opacity: 0.7,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            >
              How It Works
            </a>
          </li>
          <li>
            <a
              href="#featured-looks"
              data-testid="link-nav-explore"
              className="font-body"
              style={{
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: "0.08em",
                color: "var(--charcoal)",
                textDecoration: "none",
                textTransform: "uppercase",
                opacity: 0.7,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            >
              Explore Looks
            </a>
          </li>
          <li>
            <a
              href="#testimonials"
              data-testid="link-nav-about"
              className="font-body"
              style={{
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: "0.08em",
                color: "var(--charcoal)",
                textDecoration: "none",
                textTransform: "uppercase",
                opacity: 0.7,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            >
              About
            </a>
          </li>
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            data-testid="button-nav-sign-in"
            onClick={() => setShowSignIn(true)}
            className="font-body max-md:!hidden"
            style={{
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--charcoal)",
              background: "none",
              border: "none",
              cursor: "pointer",
              opacity: 0.7,
              transition: "opacity 0.2s",
              padding: "10px 0",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            Sign In
          </button>

          <Link
            href="/onboarding"
            data-testid="link-nav-get-started"
            className="font-body"
            style={{
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--warm-white)",
              background: "var(--charcoal)",
              padding: "10px 24px",
              textDecoration: "none",
              transition: "background 0.2s",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bark)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--charcoal)")}
          >
            Get Started
          </Link>
        </div>
      </nav>

      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  );
}
