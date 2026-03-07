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
        <label className="block text-[13px] font-medium text-muted mb-3">Monthly Budget</label>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-muted">$</span>
            <input
              type="number"
              placeholder="Min"
              value={data.budgetMin}
              onChange={(e) => update("budgetMin", e.target.value)}
              data-testid="input-budget-min"
              className="w-28 px-4 py-3 rounded-md border border-sand bg-transparent text-charcoal text-[15px] focus:outline-none focus:border-charcoal transition-colors"
              style={{ borderWidth: "1.5px" }}
            />
          </div>
          <span className="text-muted text-[14px]">to</span>
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-muted">$</span>
            <input
              type="number"
              placeholder="Max"
              value={data.budgetMax}
              onChange={(e) => update("budgetMax", e.target.value)}
              data-testid="input-budget-max"
              className="w-28 px-4 py-3 rounded-md border border-sand bg-transparent text-charcoal text-[15px] focus:outline-none focus:border-charcoal transition-colors"
              style={{ borderWidth: "1.5px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
