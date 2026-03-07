"use client";

interface StepSizingProps {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const BODY_TYPES = [
  { id: "slim", label: "Slim", icon: "▏" },
  { id: "average", label: "Average", icon: "▎" },
  { id: "athletic", label: "Athletic", icon: "▌" },
  { id: "broad", label: "Broad", icon: "█" },
];

const SHIRT_FITS = ["Slim", "Regular", "Relaxed"];
const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PANTS_FITS = ["Slim", "Straight", "Relaxed"];

export default function StepSizing({ data, onChange }: StepSizingProps) {
  function update(field: string, value: string) {
    onChange({ ...data, [field]: value });
  }

  function chipStyle(active: boolean) {
    return {
      padding: "10px 20px",
      border: `1.5px solid ${active ? "var(--charcoal)" : "var(--sand)"}`,
      background: active ? "var(--cream)" : "var(--warm-white)",
      cursor: "pointer" as const,
      transition: "all 0.2s",
      fontSize: 13,
      fontWeight: 400,
      color: "var(--charcoal)",
    };
  }

  function inputStyle() {
    return {
      width: "100%",
      padding: "10px 14px",
      border: "1.5px solid var(--sand)",
      background: "var(--warm-white)",
      fontSize: 14,
      color: "var(--charcoal)",
      outline: "none",
      transition: "border-color 0.2s",
    };
  }

  return (
    <div data-testid="step-sizing" style={{ maxWidth: 620, display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <div className="font-body" style={{ fontSize: 12, fontWeight: 400, color: "var(--muted)", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Body Type</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }} className="max-md:!grid-cols-2">
          {BODY_TYPES.map((bt) => (
            <button
              key={bt.id}
              type="button"
              onClick={() => update("bodyType", bt.id)}
              data-testid={`body-type-${bt.id}`}
              data-selected={data.bodyType === bt.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "14px 8px",
                border: `1.5px solid ${data.bodyType === bt.id ? "var(--charcoal)" : "var(--sand)"}`,
                background: data.bodyType === bt.id ? "var(--cream)" : "var(--warm-white)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 24 }}>{bt.icon}</span>
              <span className="font-body" style={{ fontSize: 12, color: "var(--charcoal)" }}>{bt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }} htmlFor="height">Height</label>
          <input id="height" type="text" placeholder="e.g. 5'10&quot;" value={data.height || ""} onChange={(e) => update("height", e.target.value)} data-testid="input-height" className="font-body" style={inputStyle()} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--charcoal)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--sand)")} />
        </div>
        <div>
          <label className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }} htmlFor="weight">Weight (lbs)</label>
          <input id="weight" type="text" placeholder="e.g. 175" value={data.weight || ""} onChange={(e) => update("weight", e.target.value)} data-testid="input-weight" className="font-body" style={inputStyle()} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--charcoal)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--sand)")} />
        </div>
      </div>

      <div>
        <div className="font-body" style={{ fontSize: 12, fontWeight: 400, color: "var(--muted)", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Shirt Fit</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {SHIRT_FITS.map((fit) => (
            <button key={fit} type="button" onClick={() => update("shirtFit", fit)} data-testid={`shirt-fit-${fit.toLowerCase()}`} className="font-body" style={chipStyle(data.shirtFit === fit)}>{fit}</button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-body" style={{ fontSize: 12, fontWeight: 400, color: "var(--muted)", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Shirt Size</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {SHIRT_SIZES.map((size) => (
            <button key={size} type="button" onClick={() => update("shirtSize", size)} data-testid={`shirt-size-${size.toLowerCase()}`} className="font-body" style={chipStyle(data.shirtSize === size)}>{size}</button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-body" style={{ fontSize: 12, fontWeight: 400, color: "var(--muted)", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Pants Fit</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {PANTS_FITS.map((fit) => (
            <button key={fit} type="button" onClick={() => update("pantsFit", fit)} data-testid={`pants-fit-${fit.toLowerCase()}`} className="font-body" style={chipStyle(data.pantsFit === fit)}>{fit}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }} htmlFor="waist">Pants Waist</label>
          <input id="waist" type="text" placeholder="e.g. 32" value={data.pantsWaist || ""} onChange={(e) => update("pantsWaist", e.target.value)} data-testid="input-pants-waist" className="font-body" style={inputStyle()} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--charcoal)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--sand)")} />
        </div>
        <div>
          <label className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }} htmlFor="inseam">Pants Inseam</label>
          <input id="inseam" type="text" placeholder="e.g. 32" value={data.pantsInseam || ""} onChange={(e) => update("pantsInseam", e.target.value)} data-testid="input-pants-inseam" className="font-body" style={inputStyle()} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--charcoal)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--sand)")} />
        </div>
      </div>

      <div>
        <label className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }} htmlFor="shoe">Shoe Size</label>
        <input id="shoe" type="text" placeholder="e.g. 10" value={data.shoeSize || ""} onChange={(e) => update("shoeSize", e.target.value)} data-testid="input-shoe-size" className="font-body" style={{ ...inputStyle(), maxWidth: 180 }} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--charcoal)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--sand)")} />
      </div>
    </div>
  );
}
