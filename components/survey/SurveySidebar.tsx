"use client";

import { SECTIONS, getActiveSteps } from "@/lib/survey-data";

interface SurveySidebarProps {
  current: number;
  visited: Set<number>;
  lifestyle: Set<string>;
  onNavigate: (index: number) => void;
}

export default function SurveySidebar({ current, visited, lifestyle, onNavigate }: SurveySidebarProps) {
  const active = getActiveSteps(lifestyle);
  const total = active.length;
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <aside
      data-testid="survey-sidebar"
      style={{
        width: 260,
        minHeight: "100vh",
        background: "var(--charcoal)",
        padding: "40px 0",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10,
      }}
      className="max-md:!hidden"
    >
      <div
        className="font-display"
        style={{
          fontSize: 18,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--cream)",
          padding: "0 32px",
          marginBottom: 40,
          fontWeight: 400,
        }}
      >
        Fitted
      </div>
      <div style={{ padding: "0 32px", marginBottom: 20 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(196,184,154,0.5)",
            marginBottom: 8,
          }}
        >
          Your Progress
        </div>
        <div
          data-testid="survey-progress-bar"
          style={{
            height: 2,
            background: "rgba(196,184,154,0.15)",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "var(--stone)",
              transition: "width 0.4s ease",
              borderRadius: 1,
              width: `${pct}%`,
            }}
          />
        </div>
      </div>
      <div
        data-testid="survey-progress-track"
        style={{ flex: 1, overflowY: "auto", padding: "0 0 40px" }}
      >
        {SECTIONS.map((sec) => {
          const secSteps = active.filter((s) => s.sectionId === sec.id);
          if (secSteps.length === 0) return null;

          const secIndices = secSteps.map((s) => active.indexOf(s));
          const isActive = secIndices.includes(current);
          const isDone = secIndices.every((i) => visited.has(i) && i < current);

          return (
            <div key={sec.id}>
              <div
                style={{
                  padding: "10px 32px 4px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: isDone
                      ? "var(--stone)"
                      : isActive
                        ? "var(--cream)"
                        : "rgba(196,184,154,0.25)",
                    flexShrink: 0,
                    transition: "background 0.3s",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 400,
                    transition: "color 0.3s",
                    color: isDone
                      ? "rgba(196,184,154,0.7)"
                      : isActive
                        ? "var(--cream)"
                        : "rgba(196,184,154,0.45)",
                  }}
                >
                  {sec.name}
                </span>
              </div>
              {(isActive || isDone) && (
                <div
                  style={{
                    paddingLeft: 50,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {secSteps.map((step) => {
                    const idx = active.indexOf(step);
                    const isCurrent = idx === current;
                    const isVisited = visited.has(idx);
                    return (
                      <div
                        key={step.id}
                        data-testid={`sidebar-step-${step.id}`}
                        onClick={() => {
                          if (isVisited || isCurrent) onNavigate(idx);
                        }}
                        style={{
                          fontSize: 11,
                          padding: "4px 0",
                          letterSpacing: "0.04em",
                          transition: "color 0.2s",
                          cursor: isVisited || isCurrent ? "pointer" : "default",
                          color: isCurrent
                            ? "var(--cream)"
                            : isVisited
                              ? "rgba(196,184,154,0.6)"
                              : "rgba(196,184,154,0.35)",
                        }}
                      >
                        {step.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
