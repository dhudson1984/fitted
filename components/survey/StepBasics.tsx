"use client";

interface BasicsData {
  ageRange: string;
  budgetMin: string;
  budgetMax: string;
}

interface StepBasicsProps {
  data: BasicsData;
  onChange: (data: BasicsData) => void;
}

const AGE_RANGES = ["18–24", "25–34", "35–44", "45–54", "55+"];
const BUDGET_RANGES = [
  "Under $50",
  "$50–$100",
  "$100–$150",
  "$150–$200",
  "$200–$300",
  "$300–$500",
  "$500+",
];

const selectStyle = (hasValue: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid var(--sand)",
  background: "var(--warm-white)",
  fontSize: 14,
  color: hasValue ? "var(--charcoal)" : "var(--muted)",
  outline: "none",
  transition: "border-color 0.2s",
  cursor: "pointer",
  appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 32,
});

const subLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: 6,
};

export default function StepBasics({ data, onChange }: StepBasicsProps) {
  function update(field: keyof BasicsData, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="max-w-xl space-y-8" data-testid="step-basics" style={{ animation: "fadeUp 0.4s ease both" }}>
      <div>
        <label className="block text-[13px] font-medium text-muted mb-3">Age Range</label>
        <div className="flex gap-3 flex-wrap">
          {AGE_RANGES.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => update("ageRange", range)}
              data-testid={`age-range-${range}`}
              className={`
                px-5 py-3 rounded-md border text-[14px] font-medium transition-all duration-200
                ${data.ageRange === range
                  ? "border-charcoal bg-charcoal text-cream"
                  : "border-sand text-charcoal hover:bg-sand/40 hover:border-stone"
                }
              `}
              style={{ borderWidth: "1.5px" }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-muted mb-3">Per Item Budget</label>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 140px", minWidth: 130 }}>
            <label htmlFor="budgetMin" className="font-body" style={subLabelStyle}>Min</label>
            <select
              id="budgetMin"
              value={data.budgetMin || ""}
              onChange={(e) => update("budgetMin", e.target.value)}
              data-testid="input-budget-min"
              className="font-body"
              style={selectStyle(!!data.budgetMin)}
            >
              <option value="">Select...</option>
              {BUDGET_RANGES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <span className="font-body" style={{ fontSize: 14, color: "var(--muted)", paddingBottom: 10 }}>to</span>

          <div style={{ flex: "1 1 140px", minWidth: 130 }}>
            <label htmlFor="budgetMax" className="font-body" style={subLabelStyle}>Max</label>
            <select
              id="budgetMax"
              value={data.budgetMax || ""}
              onChange={(e) => update("budgetMax", e.target.value)}
              data-testid="input-budget-max"
              className="font-body"
              style={selectStyle(!!data.budgetMax)}
            >
              <option value="">Select...</option>
              {BUDGET_RANGES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
