"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, ArrowLeft, ShoppingBag, Check, Shirt, Search, Palette, ScanLine, Watch } from "lucide-react";
import { useBag } from "@/components/providers/BagProvider";
import type { Piece } from "@/lib/types";

type Screen = "upload" | "analyzing" | "results";

interface AnalysisData {
  garments: { type: string; description: string }[];
  dominant_colors: string[];
  formality: string;
  vibe: string;
}

interface MatchedPieces {
  [slot: string]: Piece | null;
}

const SLOT_LABELS: Record<string, string> = {
  shirt: "Shirt",
  pants: "Pants",
  shoes: "Shoes",
  jacket: "Jacket",
  accessory: "Accessory",
};

const SLOT_ICON_COMPONENTS: Record<string, typeof Shirt> = {
  shirt: Shirt,
  pants: ScanLine,
  shoes: Search,
  jacket: Shirt,
  accessory: Watch,
};

const ANALYSIS_STEPS = [
  { label: "Identifying outfit components", Icon: Search },
  { label: "Analysing colors and style", Icon: Palette },
  { label: "Searching retailer catalogs", Icon: ShoppingBag },
  { label: "Matching to your style profile", Icon: Check },
];

export default function BuildPage() {
  const [screen, setScreen] = useState<Screen>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [pieces, setPieces] = useState<MatchedPieces>({});
  const [activeSteps, setActiveSteps] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG or PNG)");
      return;
    }
    setError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const startAnalysis = useCallback(async () => {
    if (!selectedFile) return;
    setScreen("analyzing");
    setActiveSteps([]);
    setError(null);

    const stepTimers = ANALYSIS_STEPS.map((_, i) =>
      setTimeout(() => {
        setActiveSteps((prev) => [...prev, i]);
      }, 800 * (i + 1))
    );

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/analyze-outfit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const data = await res.json();
      setAnalysis(data.analysis);
      setPieces(data.pieces);

      setActiveSteps([0, 1, 2, 3]);
      await new Promise((r) => setTimeout(r, 600));
      setScreen("results");
    } catch (err: unknown) {
      stepTimers.forEach(clearTimeout);
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setScreen("upload");
    }
  }, [selectedFile]);

  const resetBuild = useCallback(() => {
    setScreen("upload");
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setPieces({});
    setActiveSteps([]);
    setError(null);
  }, []);

  if (screen === "upload") {
    return <UploadScreen
      previewUrl={previewUrl}
      selectedFile={selectedFile}
      error={error}
      fileInputRef={fileInputRef}
      onInputChange={handleInputChange}
      onDrop={handleDrop}
      onAnalyze={startAnalysis}
    />;
  }

  if (screen === "analyzing") {
    return <AnalyzingScreen previewUrl={previewUrl} activeSteps={activeSteps} />;
  }

  return <ResultsScreen
    analysis={analysis}
    pieces={pieces}
    onTryAgain={resetBuild}
  />;
}

function UploadScreen({
  previewUrl,
  selectedFile,
  error,
  fileInputRef,
  onInputChange,
  onDrop,
  onAnalyze,
}: {
  previewUrl: string | null;
  selectedFile: File | null;
  error: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent) => void;
  onAnalyze: () => void;
}) {
  return (
    <div
      data-testid="screen-upload"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - var(--nav-h))",
        padding: "60px 40px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--bark)",
          marginBottom: 14,
        }}
      >
        Build a Look
      </p>
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
          fontSize: "clamp(36px, 5vw, 60px)",
          fontWeight: 300,
          lineHeight: 1.1,
          marginBottom: 12,
        }}
      >
        Start with
        <br />
        an image.
      </h1>
      <p
        style={{
          fontSize: 14,
          fontWeight: 300,
          color: "var(--muted)",
          maxWidth: 420,
          lineHeight: 1.7,
          marginBottom: 48,
        }}
      >
        Upload a photo of an outfit you love and we&apos;ll find the pieces for you.
      </p>

      <div
        data-testid="upload-zone"
        onClick={() => fileInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          width: "100%",
          maxWidth: 560,
          border: previewUrl ? "1.5px solid var(--stone)" : "1.5px dashed var(--stone)",
          padding: previewUrl ? 0 : "64px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          cursor: "pointer",
          transition: "all 0.3s",
          background: "var(--warm-white)",
          position: "relative",
          marginBottom: 24,
          overflow: "hidden",
        }}
      >
        {previewUrl ? (
          <img
            data-testid="image-preview"
            src={previewUrl}
            alt="Selected outfit"
            style={{
              width: "100%",
              maxHeight: 400,
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                border: "1px solid var(--stone)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: "var(--stone)",
              }}
            >
              <Upload size={24} />
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
                fontSize: 22,
                fontWeight: 300,
              }}
            >
              Drop your image here
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              or click to browse · JPG, PNG up to 10MB
            </div>
          </>
        )}
        <input
          ref={fileInputRef}
          data-testid="input-file"
          type="file"
          accept="image/jpeg,image/png"
          onChange={onInputChange}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            cursor: "pointer",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {error && (
        <p
          data-testid="text-error"
          style={{
            fontSize: 13,
            color: "#8B4A2A",
            marginBottom: 16,
            maxWidth: 560,
          }}
        >
          {error}
        </p>
      )}

      <button
        data-testid="button-analyze"
        disabled={!selectedFile}
        onClick={onAnalyze}
        style={{
          width: "100%",
          maxWidth: 560,
          padding: 16,
          background: "var(--charcoal)",
          color: "var(--cream)",
          border: "none",
          fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          cursor: selectedFile ? "pointer" : "not-allowed",
          transition: "background 0.2s",
          opacity: selectedFile ? 1 : 0.4,
        }}
        onMouseEnter={(e) => {
          if (selectedFile) e.currentTarget.style.background = "var(--bark)";
        }}
        onMouseLeave={(e) => {
          if (selectedFile) e.currentTarget.style.background = "var(--charcoal)";
        }}
      >
        Analyse This Look →
      </button>
    </div>
  );
}

function AnalyzingScreen({
  previewUrl,
  activeSteps,
}: {
  previewUrl: string | null;
  activeSteps: number[];
}) {
  return (
    <div
      data-testid="screen-analyzing"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - var(--nav-h))",
        padding: "60px 40px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 280,
          height: 320,
          marginBottom: 48,
          overflow: "hidden",
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Analyzing"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(155deg, #9B8E7A, #6B5E4C)",
            }}
          />
        )}
        <div className="analyzing-scan-line" />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="analyzing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>

      <h2
        style={{
          fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
          fontSize: 32,
          fontWeight: 300,
          marginBottom: 8,
        }}
      >
        Building your look
      </h2>
      <p
        data-testid="text-analyzing-status"
        style={{
          fontSize: 13,
          fontWeight: 300,
          color: "var(--muted)",
          minHeight: 20,
        }}
      >
        {activeSteps.length === 0
          ? "Scanning image..."
          : ANALYSIS_STEPS[Math.min(activeSteps.length - 1, 3)]?.label + "..."}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 40,
          maxWidth: 320,
          width: "100%",
        }}
      >
        {ANALYSIS_STEPS.map((step, i) => (
          <div
            key={i}
            data-testid={`step-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              border: `1px solid ${activeSteps.includes(i) ? "var(--bark)" : "var(--sand)"}`,
              background: "var(--warm-white)",
              opacity: activeSteps.includes(i) ? 1 : 0.4,
              transform: activeSteps.includes(i) ? "translateY(0)" : "translateY(8px)",
              transition: "all 0.4s",
            }}
          >
            <span
              style={{
                color: activeSteps.includes(i) ? "var(--bark)" : "var(--muted)",
                width: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.3s",
              }}
            >
              <step.Icon size={14} />
            </span>
            <span
              style={{
                fontSize: 12,
                letterSpacing: "0.06em",
                color: activeSteps.includes(i) ? "var(--charcoal)" : "var(--muted)",
                transition: "color 0.3s",
              }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsScreen({
  analysis,
  pieces,
  onTryAgain,
}: {
  analysis: AnalysisData | null;
  pieces: MatchedPieces;
  onTryAgain: () => void;
}) {
  const slotTypes = ["shirt", "pants", "shoes", "jacket", "accessory"];

  return (
    <div
      data-testid="screen-results"
      style={{ padding: "40px", maxWidth: 1200, margin: "0 auto" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 40,
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: "clamp(28px, 3vw, 42px)",
              fontWeight: 300,
              lineHeight: 1.1,
              marginBottom: 6,
            }}
          >
            Your Look, Built.
          </h2>
          <p style={{ fontSize: 13, fontWeight: 300, color: "var(--muted)" }}>
            We matched pieces based on your outfit&apos;s style, colors, and vibe.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
          <button
            data-testid="button-try-again"
            onClick={onTryAgain}
            style={{
              padding: "12px 24px",
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
              border: "1.5px solid var(--sand)",
              background: "var(--warm-white)",
              color: "var(--charcoal)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--stone)";
              e.currentTarget.style.background = "var(--cream)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--sand)";
              e.currentTarget.style.background = "var(--warm-white)";
            }}
          >
            <ArrowLeft size={14} /> Try Another
          </button>
        </div>
      </div>

      {analysis && (
        <div
          data-testid="analysis-summary"
          style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}
        >
          {analysis.formality && (
            <span
              data-testid="text-formality"
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--bark)",
                background: "var(--cream)",
                padding: "6px 14px",
                border: "1px solid var(--sand)",
              }}
            >
              {analysis.formality}
            </span>
          )}
          {analysis.vibe && (
            <span
              data-testid="text-vibe"
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--bark)",
                background: "var(--cream)",
                padding: "6px 14px",
                border: "1px solid var(--sand)",
              }}
            >
              {analysis.vibe}
            </span>
          )}
          {analysis.dominant_colors?.map((color, i) => (
            <span
              key={i}
              data-testid={`text-color-${i}`}
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                background: "var(--warm-white)",
                padding: "6px 14px",
                border: "1px solid var(--sand)",
              }}
            >
              {color}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {slotTypes.map((slot) => {
          const piece = pieces[slot] as Piece | null;
          return <SlotSection key={slot} slot={slot} piece={piece} />;
        })}
      </div>
    </div>
  );
}

function SlotSection({ slot, piece }: { slot: string; piece: Piece | null }) {
  return (
    <div data-testid={`section-${slot}`} style={{ animation: "fadeUp 0.5s ease forwards" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: "1px solid var(--sand)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {(() => { const IconComp = SLOT_ICON_COMPONENTS[slot]; return IconComp ? <IconComp size={16} style={{ color: "var(--bark)" }} /> : null; })()}
          <span
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 20,
              fontWeight: 400,
            }}
          >
            {SLOT_LABELS[slot] || slot}
          </span>
        </div>
        <span style={{ fontSize: 11, color: "var(--muted)" }}>
          {piece ? "1 match" : "No match"}
        </span>
      </div>

      {piece ? <ResultPieceCard piece={piece} /> : <PlaceholderCard slot={slot} />}
    </div>
  );
}

function ResultPieceCard({ piece }: { piece: Piece }) {
  const { addItem, items } = useBag();
  const isInBag = items.some((i) => i.id === piece.id);
  const [justAdded, setJustAdded] = useState(false);
  const added = isInBag || justAdded;

  const handleAdd = () => {
    if (added) return;
    addItem({
      id: piece.id,
      brand: piece.brand,
      name: piece.name,
      price: piece.price,
      priceStr: piece.price_display,
      retailer: piece.retailer,
      look: "Build a Look",
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const slotLabel = SLOT_LABELS[piece.slot_type] || piece.slot_type;

  return (
    <div
      data-testid={`card-piece-${piece.id}`}
      style={{
        background: "var(--warm-white)",
        border: "1.5px solid var(--sand)",
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        transition: "all 0.25s",
        maxWidth: 700,
      }}
    >
      <div
        style={{
          aspectRatio: "3/4",
          background: "var(--cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--stone)",
            fontWeight: 500,
          }}
        >
          {slotLabel}
        </div>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <div
            data-testid={`text-brand-${piece.id}`}
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--bark)",
              fontWeight: 500,
            }}
          >
            {piece.brand}
          </div>
          <div
            data-testid={`text-slot-${piece.id}`}
            style={{
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              background: "var(--cream)",
              padding: "2px 8px",
              fontWeight: 500,
            }}
          >
            {slotLabel}
          </div>
        </div>

        <div
          data-testid={`text-name-${piece.id}`}
          style={{
            fontSize: 15,
            fontWeight: 400,
            color: "var(--charcoal)",
            marginBottom: 6,
            lineHeight: 1.4,
          }}
        >
          {piece.name}
        </div>

        <div
          data-testid={`text-price-${piece.id}`}
          style={{
            fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
            fontSize: 22,
            fontWeight: 300,
            color: "var(--charcoal)",
            marginBottom: 12,
          }}
        >
          {piece.price_display}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {piece.color && (
            <span
              data-testid={`text-color-${piece.id}`}
              style={{
                fontSize: 10,
                color: "var(--muted)",
                background: "var(--cream)",
                padding: "3px 8px",
                letterSpacing: "0.06em",
              }}
            >
              {piece.color}
            </span>
          )}
          {piece.material && (
            <span
              data-testid={`text-material-${piece.id}`}
              style={{
                fontSize: 10,
                color: "var(--muted)",
                background: "var(--cream)",
                padding: "3px 8px",
                letterSpacing: "0.06em",
              }}
            >
              {piece.material}
            </span>
          )}
        </div>

        <div style={{ marginTop: "auto" }}>
          <button
            data-testid={`button-add-to-bag-${piece.id}`}
            onClick={handleAdd}
            disabled={added}
            style={{
              width: "100%",
              padding: "11px 16px",
              background: added ? "var(--stone)" : "var(--charcoal)",
              color: "var(--cream)",
              border: "none",
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: added ? "default" : "pointer",
              transition: "background 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: added ? 0.8 : 1,
            }}
            onMouseEnter={(e) => {
              if (!added) e.currentTarget.style.background = "var(--bark)";
            }}
            onMouseLeave={(e) => {
              if (!added) e.currentTarget.style.background = "var(--charcoal)";
            }}
          >
            {added ? (
              <>
                <Check size={14} />
                In Bag
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                Add to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function PlaceholderCard({ slot }: { slot: string }) {
  return (
    <div
      data-testid={`card-placeholder-${slot}`}
      style={{
        background: "var(--cream)",
        border: "1.5px dashed var(--sand)",
        padding: "40px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        maxWidth: 700,
      }}
    >
      {(() => { const IconComp = SLOT_ICON_COMPONENTS[slot]; return IconComp ? <IconComp size={28} style={{ color: "var(--stone)", opacity: 0.3 }} /> : null; })()}
      <p
        style={{
          fontSize: 13,
          color: "var(--muted)",
          fontWeight: 300,
          textAlign: "center",
        }}
      >
        No matching {SLOT_LABELS[slot]?.toLowerCase() || slot} found in our catalog
      </p>
      <p
        style={{
          fontSize: 11,
          color: "var(--stone)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Coming soon
      </p>
    </div>
  );
}
