"use client";

import { AVOID_ITEMS } from "@/lib/survey-data";

interface AvoidData {
  items: string[];
  trustStylist: boolean;
}

interface StepAvoidProps {
  data: AvoidData;
  onChange: (data: AvoidData) => void;
}

export default function StepAvoid({ data, onChange }: StepAvoidProps) {
  const { items = [], trustStylist = false } = data || {};

  function toggleItem(label: string) {
    if (trustStylist) return;
    const next = items.includes(label)
      ? items.filter((s) => s !== label)
      : [...items, label];
    onChange({ items: next, trustStylist: false });
  }

  function toggleTrust() {
    onChange({ items: [], trustStylist: !trustStylist });
  }

  return (
    <div data-testid="step-avoid" style={{ maxWidth: 620 }}>
      <button
        type="button"
        onClick={toggleTrust}
        data-testid="button-trust-stylist"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "14px 20px",
          marginBottom: 24,
          border: `1.5px solid ${trustStylist ? "var(--charcoal)" : "var(--sand)"}`,
          background: trustStylist ? "var(--charcoal)" : "var(--warm-white)",
          color: trustStylist ? "var(--cream)" : "var(--charcoal)",
          cursor: "pointer",
          transition: "all 0.2s",
          fontSize: 14,
          fontWeight: 500,
        }}
        className="font-body"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" stroke="currentColor" strokeWidth="1.5" fill={trustStylist ? "currentColor" : "none"} />
        </svg>
        I Trust My Stylist
      </button>

      <div
        data-testid="avoid-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          transition: "opacity 0.2s",
          opacity: trustStylist ? 0.3 : 1,
          pointerEvents: trustStylist ? "none" : "auto",
        }}
        className="max-md:!grid-cols-2"
      >
        {AVOID_ITEMS.map((item) => {
          const isSelected = items.includes(item.label);
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => toggleItem(item.label)}
              data-testid={`avoid-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              data-selected={isSelected}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "14px 8px",
                border: `1.5px solid ${isSelected ? "var(--charcoal)" : "var(--sand)"}`,
                background: isSelected ? "var(--cream)" : "var(--warm-white)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span
                className="font-body"
                style={{ fontSize: 12, fontWeight: 400, color: "var(--charcoal)" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
