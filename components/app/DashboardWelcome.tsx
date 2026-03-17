"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardWelcome() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [lifestyleCategories, setLifestyleCategories] = useState<string[]>([]);
  const [styleTags, setStyleTags] = useState<string[]>([]);

  useEffect(() => {
    try {
      const survey = localStorage.getItem("fitted_survey");
      const seen = localStorage.getItem("fitted_has_seen_welcome");
      if (survey && !seen) {
        const parsed = JSON.parse(survey);

        const categories: string[] = parsed.lifestyle || [];
        setLifestyleCategories(categories);

        const tags: string[] = [...categories];

        const lifestyleStep = parsed["lifestyle-4"];
        if (Array.isArray(lifestyleStep) && lifestyleStep.length > 0) {
          tags.push(...lifestyleStep);
        }

        const workStyle = parsed["lifestyle-2"];
        if (Array.isArray(workStyle) && workStyle.length > 0) {
          tags.push(...workStyle);
        }

        const weekendVibe = parsed["lifestyle-3"];
        if (Array.isArray(weekendVibe) && weekendVibe.length > 0) {
          tags.push(...weekendVibe);
        }

        setStyleTags(Array.from(new Set(tags)));
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

  function handleBuildLook() {
    dismiss();
    router.push("/build");
  }

  if (!visible) return null;

  return (
    <div
      data-testid="welcome-overlay"
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        background: "var(--warm-white)",
        padding: 40,
      }}
    >
      <div
        data-testid="welcome-inner"
        style={{
          maxWidth: 580,
          width: "100%",
        }}
        className="max-md:pt-[60px]"
      >
        <div
          data-testid="text-welcome-eyebrow"
          className="font-body"
          style={{
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--bark)",
            marginBottom: 16,
          }}
        >
          Welcome to Fitted
        </div>

        <h1
          data-testid="text-welcome-title"
          className="font-display"
          style={{
            fontSize: "clamp(40px,6vw,68px)",
            fontWeight: 300,
            lineHeight: 1.05,
            marginBottom: 20,
            color: "var(--charcoal)",
          }}
        >
          Your style profile
          <br />
          is ready.
        </h1>

        <p
          data-testid="text-welcome-subtitle"
          className="font-body"
          style={{
            fontSize: 15,
            fontWeight: 300,
            color: "var(--muted)",
            lineHeight: 1.7,
            marginBottom: 36,
            maxWidth: 460,
          }}
        >
          We&apos;ve analysed your answers and we&apos;re ready to start building
          looks for you. The best way to start is to upload an outfit you love
          &mdash; we&apos;ll find every piece.
        </p>

        {styleTags.length > 0 && (
          <div
            data-testid="welcome-summary"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 40,
            }}
          >
            {styleTags.map((tag) => (
              <span
                key={tag}
                data-testid={`welcome-tag-${tag.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                className="font-body"
                style={{
                  padding: "6px 14px",
                  border: "1.5px solid var(--sand)",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--charcoal)",
                  background: "var(--cream)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div
          data-testid="welcome-actions"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxWidth: 340,
          }}
          className="max-md:!max-w-full"
        >
          <button
            data-testid="button-welcome-build"
            className="font-body"
            onClick={handleBuildLook}
            style={{
              padding: "16px 32px",
              background: "var(--charcoal)",
              color: "var(--cream)",
              border: "none",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.2s",
              textAlign: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--charcoal)")
            }
          >
            Build Your First Look &rarr;
          </button>

          <button
            data-testid="button-welcome-dashboard"
            className="font-body"
            onClick={dismiss}
            style={{
              padding: "14px 32px",
              background: "transparent",
              color: "var(--muted)",
              border: "1.5px solid var(--sand)",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "center",
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
            Take Me to My Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
