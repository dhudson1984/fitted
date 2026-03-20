"use client";

interface StepMultiSelectProps {
  options: { icon?: string; label: string; sub: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multi?: boolean;
  error?: string;
}

export default function StepMultiSelect({ options, selected, onChange, multi = true, error }: StepMultiSelectProps) {
  function toggle(label: string) {
    if (multi) {
      if (selected.includes(label)) {
        onChange(selected.filter((s) => s !== label));
      } else {
        onChange([...selected, label]);
      }
    } else {
      onChange(selected.includes(label) ? [] : [label]);
    }
  }

  return (
    <div>
      <div
        data-testid="step-multi-select"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
        }}
        className="max-md:!grid-cols-2 max-md:!gap-2.5"
      >
        {options.map((opt) => {
          const isSelected = selected.includes(opt.label);
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => toggle(opt.label)}
              data-testid={`option-${opt.label.toLowerCase().replace(/\s+/g, "-")}`}
              data-selected={isSelected}
              style={{
                border: `1.5px solid ${isSelected ? "var(--charcoal)" : "var(--sand)"}`,
                padding: "18px 20px",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                background: isSelected ? "var(--cream)" : "var(--warm-white)",
                textAlign: "left",
              }}
            >
              {opt.icon && <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{opt.icon}</span>}
              <div>
                <div
                  className="font-body"
                  style={{ fontSize: 14, fontWeight: 400, color: "var(--charcoal)", marginBottom: 2 }}
                >
                  {opt.label}
                </div>
                <div
                  className="font-body"
                  style={{ fontSize: 12, fontWeight: 300, color: "var(--muted)" }}
                >
                  {opt.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {error && (
        <p
          data-testid="error-lifestyle"
          className="font-body"
          style={{ fontSize: 12, color: "var(--muted)", marginTop: 10, lineHeight: 1.4 }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
