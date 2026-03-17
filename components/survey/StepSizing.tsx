"use client";

interface StepSizingProps {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const BODY_TYPES = [
  { id: "slim", label: "Slim" },
  { id: "average", label: "Average" },
  { id: "athletic", label: "Athletic" },
  { id: "broad", label: "Broad" },
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

function BodyTypeSvg({ type, selected }: { type: string; selected: boolean }) {
  const stroke = selected ? "var(--charcoal)" : "var(--stone)";
  const fill = selected ? "var(--sand)" : "none";

  if (type === "slim") {
    return (
      <svg width="40" height="56" viewBox="0 0 40 56" fill="none">
        <ellipse cx="20" cy="7" rx="5" ry="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <path d="M15 16 C15 16 14 20 14 26 L14 44 C14 46 15 47 16 47 L17 47 L17 55" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M25 16 C25 16 26 20 26 26 L26 44 C26 46 25 47 24 47 L23 47 L23 55" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M15 16 C17 15 23 15 25 16" stroke={stroke} strokeWidth="1.5" fill="none" />
        <path d="M13 18 L11 28" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M27 18 L29 28" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "average") {
    return (
      <svg width="40" height="56" viewBox="0 0 40 56" fill="none">
        <ellipse cx="20" cy="7" rx="5.5" ry="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <path d="M13 16 C13 16 12 20 12 26 L13 44 C13 46 14 47 15 47 L17 47 L16 55" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M27 16 C27 16 28 20 28 26 L27 44 C27 46 26 47 25 47 L23 47 L24 55" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M13 16 C16 14.5 24 14.5 27 16" stroke={stroke} strokeWidth="1.5" fill="none" />
        <path d="M11 18 L8 28" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M29 18 L32 28" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "athletic") {
    return (
      <svg width="40" height="56" viewBox="0 0 40 56" fill="none">
        <ellipse cx="20" cy="7" rx="6" ry="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <path d="M10 16 C10 18 11 22 12 26 L13 36 L14 44 C14 46 15 47 16 47 L18 47 L17 55" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M30 16 C30 18 29 22 28 26 L27 36 L26 44 C26 46 25 47 24 47 L22 47 L23 55" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M10 16 C14 14 26 14 30 16" stroke={stroke} strokeWidth="1.5" fill="none" />
        <path d="M8 18 L5 28" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 18 L35 28" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="40" height="56" viewBox="0 0 40 56" fill="none">
      <ellipse cx="20" cy="7" rx="6.5" ry="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <path d="M9 16 C9 18 9 22 10 26 L11 36 L12 44 C12 46 13 47 14 47 L17 47 L16 55" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M31 16 C31 18 31 22 30 26 L29 36 L28 44 C28 46 27 47 26 47 L23 47 L24 55" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M9 16 C13 13.5 27 13.5 31 16" stroke={stroke} strokeWidth="1.5" fill="none" />
      <path d="M7 18 L4 28" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M33 18 L36 28" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

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
                gap: 8,
                padding: "16px 8px 12px",
                border: `1.5px solid ${data.bodyType === bt.id ? "var(--charcoal)" : "var(--sand)"}`,
                background: data.bodyType === bt.id ? "var(--cream)" : "var(--warm-white)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <BodyTypeSvg type={bt.id} selected={data.bodyType === bt.id} />
              <span className="font-body" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.04em", color: data.bodyType === bt.id ? "var(--charcoal)" : "var(--muted)" }}>{bt.label}</span>
            </button>
          ))}
        </div>
      </div>

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
          <select id="waist" value={data.pantsWaist || ""} onChange={(e) => update("pantsWaist", e.target.value)} data-testid="input-pants-waist" className="font-body" style={selectStyle(!!data.pantsWaist)}>
            <option value="">Select...</option>
            {PANTS_WAISTS.map((w) => <option key={w} value={w}>{w}"</option>)}
          </select>
        </div>
        <div>
          <label className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }} htmlFor="inseam">Pants Inseam</label>
          <select id="inseam" value={data.pantsInseam || ""} onChange={(e) => update("pantsInseam", e.target.value)} data-testid="input-pants-inseam" className="font-body" style={selectStyle(!!data.pantsInseam)}>
            <option value="">Select...</option>
            {PANTS_INSEAMS.map((i) => <option key={i} value={i}>{i}"</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }} htmlFor="shoe">Shoe Size</label>
        <select id="shoe" value={data.shoeSize || ""} onChange={(e) => update("shoeSize", e.target.value)} data-testid="input-shoe-size" className="font-body" style={{ ...selectStyle(!!data.shoeSize), maxWidth: 180 }}>
          <option value="">Select...</option>
          {SHOE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}
