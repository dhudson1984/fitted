"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, ArrowLeft, ShoppingBag, Check, Shirt, Search, Palette, ScanLine, Watch, Bookmark, X } from "lucide-react";
import { useBag } from "@/components/providers/BagProvider";
import PieceCard from "@/components/app/PieceCard";
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

function compressImageToBase64(file: File, maxDim = 400, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round(h * (maxDim / w)); w = maxDim; }
          else { w = Math.round(w * (maxDim / h)); h = maxDim; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas context failed")); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function BuildPage() {
  const [screen, setScreen] = useState<Screen>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [pieces, setPieces] = useState<MatchedPieces>({});
  const [activeSteps, setActiveSteps] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
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
    try {
      const b64 = await compressImageToBase64(file);
      setImageBase64(b64);
    } catch {}
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
    setImageBase64(null);
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
    imageBase64={imageBase64}
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
  imageBase64,
  onTryAgain,
}: {
  analysis: AnalysisData | null;
  pieces: MatchedPieces;
  imageBase64: string | null;
  onTryAgain: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const slotTypes = ["shirt", "pants", "shoes", "jacket", "accessory"];
  const matchedPieces = slotTypes
    .map((slot, i) => {
      const p = pieces[slot] as Piece | null;
      return p ? { ...p, sort_order: i } : null;
    })
    .filter(Boolean) as (Piece & { sort_order: number })[];

  const emptySlots = slotTypes.filter((s) => !pieces[s]);

  const handleSaveClick = () => {
    if (saved || matchedPieces.length === 0) return;
    setShowNameModal(true);
  };

  const [saveError, setSaveError] = useState<string | null>(null);

  const handleConfirmSave = (name: string) => {
    const build = {
      id: `build-${Date.now()}`,
      name,
      pieceIds: matchedPieces.map((p) => p.id),
      pieces: matchedPieces.map((p) => ({
        id: p.id,
        brand: p.brand,
        name: p.name,
        price: p.price,
        price_display: p.price_display,
        slot_type: p.slot_type,
        color: p.color,
      })),
      analysis: analysis ? { formality: analysis.formality, vibe: analysis.vibe, colors: analysis.dominant_colors } : null,
      thumbnail: imageBase64 || null,
      createdAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem("fitted_builds") || "[]");
      existing.unshift(build);
      localStorage.setItem("fitted_builds", JSON.stringify(existing));
      setSaved(true);
      setShowNameModal(false);
      setSaveError(null);
    } catch {
      try {
        build.thumbnail = null;
        const existing = JSON.parse(localStorage.getItem("fitted_builds") || "[]");
        existing.unshift(build);
        localStorage.setItem("fitted_builds", JSON.stringify(existing));
        setSaved(true);
        setShowNameModal(false);
        setSaveError(null);
      } catch {
        setSaveError("Could not save — storage is full. Try clearing some saved looks first.");
      }
    }
  };

  const tags = [
    ...(analysis?.formality ? [{ label: analysis.formality, type: "formality" }] : []),
    ...(analysis?.vibe ? [{ label: analysis.vibe, type: "vibe" }] : []),
  ];

  return (
    <main
      data-testid="screen-results"
      className="min-h-screen"
      style={{ background: "var(--warm-white)" }}
    >
      <div
        style={{
          borderBottom: "1px solid var(--sand)",
          background: "var(--warm-white)",
          position: "sticky",
          top: "var(--nav-h)",
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <button
            data-testid="button-try-again"
            onClick={onTryAgain}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "var(--muted)",
              background: "none",
              border: "none",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "color 0.2s",
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
            }}
          >
            <ArrowLeft size={16} />
            Build Another
          </button>

          <button
            data-testid="button-save-look"
            onClick={handleSaveClick}
            disabled={saved || matchedPieces.length === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: saved ? "var(--stone)" : "var(--charcoal)",
              color: "var(--cream)",
              border: "none",
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: saved ? "default" : "pointer",
              transition: "background 0.2s",
              opacity: saved ? 0.8 : matchedPieces.length === 0 ? 0.4 : 1,
            }}
            onMouseEnter={(e) => {
              if (!saved && matchedPieces.length > 0) e.currentTarget.style.background = "var(--bark)";
            }}
            onMouseLeave={(e) => {
              if (!saved && matchedPieces.length > 0) e.currentTarget.style.background = "var(--charcoal)";
            }}
          >
            {saved ? <Check size={14} /> : <Bookmark size={14} />}
            {saved ? "Look Saved" : "Save This Look"}
          </button>
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(165deg, #5C5A6E 0%, #3A3848 40%, #1E1C28 100%)",
          padding: "48px 24px 56px",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(26,26,24,0.7) 0%, rgba(26,26,24,0.3) 60%, transparent 100%)",
          }}
        />
        <div
          className="relative"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(250,247,242,0.5)",
              marginBottom: 12,
            }}
          >
            Your Build
          </div>
          <h1
            data-testid="text-results-title"
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 300,
              color: "rgba(250,247,242,0.95)",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Your Look, Built.
          </h1>

          {tags.length > 0 && (
            <div
              data-testid="analysis-summary"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {tags.map((tag) => (
                <span
                  key={tag.type}
                  data-testid={`badge-${tag.type}`}
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    color: "rgba(250,247,242,0.9)",
                    background: "rgba(250,247,242,0.18)",
                    padding: "5px 12px",
                    borderRadius: 3,
                  }}
                >
                  {tag.label}
                </span>
              ))}
              {analysis?.dominant_colors?.map((color, i) => (
                <span
                  key={i}
                  data-testid={`badge-color-${i}`}
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    color: "rgba(250,247,242,0.6)",
                    background: "rgba(250,247,242,0.08)",
                    padding: "5px 12px",
                    borderRadius: 3,
                  }}
                >
                  {color}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <h2
            data-testid="text-pieces-heading"
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 24,
              fontWeight: 300,
              color: "var(--charcoal)",
              marginBottom: 4,
            }}
          >
            The Pieces
          </h2>
          <p
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: "var(--muted)",
              marginBottom: 24,
            }}
          >
            {matchedPieces.length} item{matchedPieces.length !== 1 ? "s" : ""} matched to your outfit
            {emptySlots.length > 0 && ` · ${emptySlots.length} slot${emptySlots.length !== 1 ? "s" : ""} pending`}
          </p>
        </div>

        <div
          data-testid="pieces-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {matchedPieces.map((piece) => (
            <PieceCard key={piece.id} piece={piece} lookName="Your Build" />
          ))}
        </div>

        {emptySlots.length > 0 && (
          <div
            data-testid="empty-slots"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 20,
            }}
          >
            {emptySlots.map((slot) => {
              const SlotIcon = SLOT_ICON_COMPONENTS[slot] || Shirt;
              return (
                <div
                  key={slot}
                  style={{
                    flex: "1 1 200px",
                    padding: "32px 20px",
                    border: "1.5px dashed var(--sand)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <SlotIcon size={20} style={{ color: "var(--stone)" }} />
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                    }}
                  >
                    {SLOT_LABELS[slot] || slot}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--stone)" }}>Coming soon</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showNameModal && (
        <NameLookModal
          onConfirm={handleConfirmSave}
          onCancel={() => { setShowNameModal(false); setSaveError(null); }}
          error={saveError}
        />
      )}
    </main>
  );
}

function NameLookModal({
  onConfirm,
  onCancel,
  error,
}: {
  onConfirm: (name: string) => void;
  onCancel: () => void;
  error?: string | null;
}) {
  const now = new Date();
  const monthDay = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const [name, setName] = useState(`My Build — ${monthDay}`);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.select(), 100);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
  };

  return (
    <div
      data-testid="modal-name-look"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(26,26,24,0.5)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onCancel}
      />
      <form
        onSubmit={handleSubmit}
        data-testid="form-name-look"
        style={{
          position: "relative",
          background: "var(--warm-white)",
          border: "1px solid var(--sand)",
          padding: "36px 32px 28px",
          maxWidth: 420,
          width: "100%",
          animation: "fadeUp 0.25s ease-out",
        }}
      >
        <button
          type="button"
          data-testid="button-close-name-modal"
          onClick={onCancel}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--muted)",
            padding: 4,
          }}
        >
          <X size={16} />
        </button>

        <h3
          style={{
            fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
            fontSize: 24,
            fontWeight: 300,
            color: "var(--charcoal)",
            marginBottom: 6,
          }}
        >
          Name your look
        </h3>
        <p
          style={{
            fontSize: 13,
            fontWeight: 300,
            color: "var(--muted)",
            marginBottom: 24,
            lineHeight: 1.5,
          }}
        >
          Give this build a name so you can find it later.
        </p>

        <input
          ref={inputRef}
          data-testid="input-look-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "1.5px solid var(--sand)",
            background: "var(--cream)",
            fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
            fontSize: 14,
            color: "var(--charcoal)",
            outline: "none",
            transition: "border-color 0.2s",
            marginBottom: 24,
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--stone)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--sand)")}
        />

        {error && (
          <p
            data-testid="text-save-error"
            style={{
              fontSize: 12,
              color: "#8B4A2A",
              marginBottom: 16,
              lineHeight: 1.5,
            }}
          >
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            data-testid="button-confirm-save"
            disabled={!name.trim()}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: name.trim() ? "var(--charcoal)" : "var(--sand)",
              color: "var(--cream)",
              border: "none",
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: name.trim() ? "pointer" : "not-allowed",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              if (name.trim()) e.currentTarget.style.background = "var(--bark)";
            }}
            onMouseLeave={(e) => {
              if (name.trim()) e.currentTarget.style.background = "var(--charcoal)";
            }}
          >
            Save Look
          </button>
          <button
            type="button"
            data-testid="button-cancel-save"
            onClick={onCancel}
            style={{
              padding: "12px 20px",
              background: "transparent",
              color: "var(--muted)",
              border: "1.5px solid var(--sand)",
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
