"use client";

interface StepSizingProps {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
  errors?: Record<string, string>;
}

const BODY_TYPES = [
  { id: "slim",     label: "Slim",     desc: "Narrow build" },
  { id: "average",  label: "Average",  desc: "Medium build" },
  { id: "athletic", label: "Athletic", desc: "Broad shoulders, tapered waist" },
  { id: "broad",    label: "Broad",    desc: "Full, wider build" },
];

const SHIRT_FITS = ["Slim", "Regular", "Relaxed"];
const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PANTS_FITS = ["Slim", "Straight", "Relaxed"];

const HEIGHTS = Array.from({ length: 19 }, (_, i) => {
  const totalInches = 60 + i;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}"`;
});

const WEIGHTS = Array.from({ length: 33 }, (_, i) => `${120 + i * 5} lbs`);

const PANTS_WAISTS = Array.from({ length: 15 }, (_, i) => `${28 + i}`);

const PANTS_INSEAMS = ["28", "29", "30", "31", "32", "33", "34", "36"];

const SHOE_SIZES = Array.from({ length: 17 }, (_, i) => {
  const size = 7 + i * 0.5;
  return Number.isInteger(size) ? `${size}` : `${size}`;
});

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      className="font-body"
      style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}
    >
      {message}
    </p>
  );
}

export default function StepSizing({ data, onChange, errors = {} }: StepSizingProps) {
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

  function selectStyle(hasValue: boolean) {
    return {
      width: "100%",
      padding: "10px 14px",
      border: "1.5px solid var(--sand)",
      background: "var(--warm-white)",
      fontSize: 14,
      color: hasValue ? "var(--charcoal)" : "var(--muted)",
      outline: "none",
      transition: "border-color 0.2s",
      cursor: "pointer" as const,
      appearance: "none" as const,
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      paddingRight: 32,
    };
  }

  return (
    <div data-testid="step-sizing" style={{ maxWidth: 620, display: "flex", flexDirection: "column", gap: 32 }}>

      {/* Body Type */}
      <div>
        <div className="font-body" style={{ fontSize: 12, fontWeight: 400, color: "var(--muted)", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Body Type</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }} className="max-md:!grid-cols-2">
          {BODY_TYPES.map((bt) => {
            const active = data.bodyType === bt.id;
            return (
              <button
                key={bt.id}
                type="button"
                onClick={() => update("bodyType", bt.id)}
                data-testid={`body-type-${bt.id}`}
                data-selected={active}
                className="font-body"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 4,
                  padding: "14px 16px",
                  border: `1.5px solid ${active ? "var(--charcoal)" : "var(--sand)"}`,
                  background: active ? "var(--charcoal)" : "var(--warm-white)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: active ? "var(--cream)" : "var(--charcoal)" }}>
                  {bt.label}
                </span>
                <span style={{ fontSize: 11, fontWeight: 400, color: active ? "rgba(255,248,235,0.65)" : "var(--muted)", lineHeight: 1.35 }}>
                  {bt.desc}
                </span>
              </button>
            );
          })}
        </div>
        <FieldError message={errors.bodyType} />
      </div>

      {/* Height + Weight (both optional) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }} htmlFor="height">Height</label>
          <select id="height" value={data.height || ""} onChange={(e) => update("height", e.target.value)} data-testid="input-height" className="font-body" style={selectStyle(!!data.height)}>
            <option value="">Select...</option>
            {HEIGHTS.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div>
          <label className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }} htmlFor="weight">Weight</label>
          <select id="weight" value={data.weight || ""} onChange={(e) => update("weight", e.target.value)} data-testid="input-weight" className="font-body" style={selectStyle(!!data.weight)}>
            <option value="">Select...</option>
            {WEIGHTS.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>

      {/* Shirt Fit */}
      <div>
        <div className="font-body" style={{ fontSize: 12, fontWeight: 400, color: "var(--muted)", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Shirt Fit</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {SHIRT_FITS.map((fit) => (
            <button key={fit} type="button" onClick={() => update("shirtFit", fit)} data-testid={`shirt-fit-${fit.toLowerCase()}`} className="font-body" style={chipStyle(data.shirtFit === fit)}>{fit}</button>
          ))}
        </div>
        <FieldError message={errors.shirtFit} />
      </div>

      {/* Shirt Size */}
      <div>
        <div className="font-body" style={{ fontSize: 12, fontWeight: 400, color: "var(--muted)", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Shirt Size</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {SHIRT_SIZES.map((size) => (
            <button key={size} type="button" onClick={() => update("shirtSize", size)} data-testid={`shirt-size-${size.toLowerCase()}`} className="font-body" style={chipStyle(data.shirtSize === size)}>{size}</button>
          ))}
        </div>
        <FieldError message={errors.shirtSize} />
      </div>

      {/* Pants Fit */}
      <div>
        <div className="font-body" style={{ fontSize: 12, fontWeight: 400, color: "var(--muted)", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Pants Fit</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {PANTS_FITS.map((fit) => (
            <button key={fit} type="button" onClick={() => update("pantsFit", fit)} data-testid={`pants-fit-${fit.toLowerCase()}`} className="font-body" style={chipStyle(data.pantsFit === fit)}>{fit}</button>
          ))}
        </div>
        <FieldError message={errors.pantsFit} />
      </div>

      {/* Pants Waist + Inseam */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }} htmlFor="waist">Pants Waist</label>
          <select id="waist" value={data.pantsWaist || ""} onChange={(e) => update("pantsWaist", e.target.value)} data-testid="input-pants-waist" className="font-body" style={selectStyle(!!data.pantsWaist)}>
            <option value="">Select...</option>
            {PANTS_WAISTS.map((w) => <option key={w} value={w}>{w}&quot;</option>)}
          </select>
          <FieldError message={errors.pantsWaist} />
        </div>
        <div>
          <label className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }} htmlFor="inseam">Pants Inseam</label>
          <select id="inseam" value={data.pantsInseam || ""} onChange={(e) => update("pantsInseam", e.target.value)} data-testid="input-pants-inseam" className="font-body" style={selectStyle(!!data.pantsInseam)}>
            <option value="">Select...</option>
            {PANTS_INSEAMS.map((i) => <option key={i} value={i}>{i}&quot;</option>)}
          </select>
          <FieldError message={errors.pantsInseam} />
        </div>
      </div>

      {/* Shoe Size */}
      <div>
        <label className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }} htmlFor="shoe">Shoe Size</label>
        <select id="shoe" value={data.shoeSize || ""} onChange={(e) => update("shoeSize", e.target.value)} data-testid="input-shoe-size" className="font-body" style={{ ...selectStyle(!!data.shoeSize), maxWidth: 180 }}>
          <option value="">Select...</option>
          {SHOE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <FieldError message={errors.shoeSize} />
      </div>

    </div>
  );
}
