"use client";

import { useState, useEffect, useCallback } from "react";

const SUPABASE_STORAGE = "https://yjbzqcypgekdydmoafbj.supabase.co/storage/v1/object/public/hero";

const slides = [
  { imageUrl: `${SUPABASE_STORAGE}/smart-casual.jpeg`, category: "Smart Casual" },
  { imageUrl: `${SUPABASE_STORAGE}/Work%202%20(1).jpeg`, category: "Work" },
  { imageUrl: `${SUPABASE_STORAGE}/night-out.jpg`,     category: "Night Out" },
  { imageUrl: `${SUPABASE_STORAGE}/athletic.jpg`,      category: "Athletic & Outdoors" },
];

export default function HeroSlideshow() {
  const [active, setActive] = useState(0);

  const goToSlide = useCallback((i: number) => setActive(i), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      data-testid="hero-section"
      className="max-md:!min-h-0 max-md:!pb-[90px]"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 700,
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        paddingBottom: 80,
      }}
    >
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            data-testid={`hero-slide-${i}`}
            style={{
              position: "absolute",
              inset: 0,
              opacity: active === i ? 1 : 0,
              transition: "opacity 1.2s ease",
              backgroundImage: `url("${slide.imageUrl}")`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          >
            {/* Uniform dark veil for readability */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(20,18,14,0.45)",
              }}
            />
            {/* Bottom-up gradient for text legibility */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top,rgba(20,18,14,0.90) 0%,rgba(20,18,14,0.25) 55%,transparent 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: 60,
                transform: "translateY(-50%)",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,0.5)",
                  writingMode: "vertical-rl",
                }}
              >
                {slide.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "0 60px",
          maxWidth: 700,
        }}
        className="max-md:!px-6 max-md:!max-w-full"
      >
        <p
          data-testid="text-hero-eyebrow"
          style={{
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--stone)",
            marginBottom: 20,
            opacity: 0,
            animation: "fadeUp 0.8s ease 0.3s forwards",
          }}
          className="max-md:!text-[9px]"
        >
          Introducing Fitted
        </p>
        <h1
          data-testid="text-hero-title"
          className="font-display max-md:!text-[clamp(36px,10vw,56px)]"
          style={{
            fontSize: "clamp(52px,7vw,88px)",
            fontWeight: 300,
            lineHeight: 1,
            color: "var(--cream)",
            marginBottom: 8,
            opacity: 0,
            animation: "fadeUp 0.8s ease 0.5s forwards",
          }}
        >
          Fitted.
        </h1>
        <p
          data-testid="text-hero-subtitle"
          className="font-display"
          style={{
            fontSize: "clamp(16px,2vw,22px)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--stone)",
            marginBottom: 40,
            opacity: 0,
            animation: "fadeUp 0.8s ease 0.7s forwards",
          }}
        >
          Your Personal Virtual Stylist.
        </p>
        <a
          href="/onboarding"
          data-testid="link-hero-cta"
          className="font-body"
          style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--charcoal)",
            background: "var(--cream)",
            padding: "16px 40px",
            textDecoration: "none",
            transition: "background 0.25s",
            opacity: 0,
            animation: "fadeUp 0.8s ease 0.9s forwards",
            cursor: "pointer",
            border: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--stone)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--cream)")}
        >
          Build Your Look
        </a>
      </div>

      <div
        data-testid="hero-indicators"
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          zIndex: 3,
          display: "flex",
          gap: 8,
        }}
        className="max-md:!right-6 max-md:!bottom-6"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            data-testid={`hero-indicator-${i}`}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: active === i ? 40 : 24,
              height: 2,
              background: active === i ? "var(--cream)" : "rgba(245,240,232,0.3)",
              cursor: "pointer",
              transition: "background 0.3s, width 0.3s",
              border: "none",
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
