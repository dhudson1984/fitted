"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Settings, RefreshCw, Wand2, Pencil, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Look } from "@/lib/types";
import LookCard from "@/components/app/LookCard";

interface SurveyData {
  firstName?: string;
  email?: string;
  lifestyle?: string[];
  completedAt?: string;
  "intro-1"?: { firstName?: string; email?: string };
  "lifestyle-1"?: string[];
  "lifestyle-2"?: string | string[];
  "lifestyle-3"?: string | string[];
  "lifestyle-4"?: string | string[];
  "colors-1"?: string[];
  "colors-2"?: string | string[];
  "avoid-1"?: { items?: string[]; trustStylist?: boolean } | string[];
  "sizing-1"?: Record<string, string>;
  "basics-1"?: Record<string, string>;
  "inspo-1"?: string[];
}

interface LookWithPieceCount extends Look {
  pieceCount: number;
}

interface SavedBuild {
  id: string;
  name: string;
  pieceIds: string[];
  pieces: { id: string; brand: string; name: string; slot_type: string; color?: string }[];
  analysis: { formality?: string; vibe?: string; colors?: string[] } | null;
  createdAt: string;
}

function extractValue(val: string | string[] | undefined): string {
  if (!val) return "";
  return Array.isArray(val) ? val[0] || "" : val;
}

export default function ProfilePage() {
  const router = useRouter();
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [savedLooks, setSavedLooks] = useState<LookWithPieceCount[]>([]);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fitted_survey");
      if (raw) setSurvey(JSON.parse(raw));
    } catch {}

    try {
      const buildsRaw = localStorage.getItem("fitted_builds");
      if (buildsRaw) setSavedBuilds(JSON.parse(buildsRaw));
    } catch {}

    async function fetchLooks() {
      const savedSlugs = JSON.parse(localStorage.getItem("fitted_saved_looks") || "[]");
      if (savedSlugs.length > 0) {
        const { data: looks } = await supabase
          .from("looks")
          .select("*")
          .in("slug", savedSlugs)
          .limit(6);

        if (looks) {
          const looksWithCounts: LookWithPieceCount[] = [];
          for (const look of looks) {
            const { count } = await supabase
              .from("look_pieces")
              .select("*", { count: "exact", head: true })
              .eq("look_id", look.id);
            looksWithCounts.push({ ...look, pieceCount: count || 0 });
          }
          setSavedLooks(looksWithCounts);
        }
      }
      setLoading(false);
    }
    fetchLooks();
  }, []);

  const firstName = survey?.firstName || survey?.["intro-1"]?.firstName || "Guest";
  const email = survey?.email || survey?.["intro-1"]?.email || "";
  const lifestyle = survey?.lifestyle || survey?.["lifestyle-1"] || [];
  const overallStyle = extractValue(survey?.["lifestyle-4"]);
  const workStyle = extractValue(survey?.["lifestyle-2"]);
  const weekendStyle = extractValue(survey?.["lifestyle-3"]);
  const colorPalettes = survey?.["colors-1"] || [];
  const printsPref = extractValue(survey?.["colors-2"]);
  const avoidRaw = survey?.["avoid-1"];
  const avoidItems: string[] = Array.isArray(avoidRaw)
    ? avoidRaw
    : (avoidRaw as { items?: string[] })?.items || [];
  const sizing = survey?.["sizing-1"] || {};
  const basics = survey?.["basics-1"] || {};
  const brands = survey?.["inspo-1"] || [];
  const completedAt = survey?.completedAt;

  const memberSince = completedAt
    ? new Date(completedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  const handleRetakeSurvey = () => {
    localStorage.removeItem("fitted_survey");
    localStorage.removeItem("fitted_has_seen_welcome");
    document.cookie = "fitted_survey_completed=; path=/; max-age=0";
    router.push("/onboarding");
  };

  const startEdit = (section: string) => {
    if (section === "style") {
      setEditDraft({
        overallStyle: overallStyle || "",
        workStyle: workStyle || "",
        weekendStyle: weekendStyle || "",
        printsPref: printsPref || "",
      });
    } else if (section === "sizing") {
      setEditDraft({
        bodyType: sizing.bodyType || "",
        height: sizing.height || "",
        weight: sizing.weight || "",
        shirtSize: sizing.shirtSize || "",
        shirtFit: sizing.shirtFit || "",
        pantsWaist: sizing.pantsWaist || "",
        pantsInseam: sizing.pantsInseam || "",
        pantsFit: sizing.pantsFit || "",
        shoeSize: sizing.shoeSize || "",
      });
    } else if (section === "budget") {
      setEditDraft({
        ageRange: basics.ageRange || "",
        budgetMin: basics.budgetMin || "",
        budgetMax: basics.budgetMax || "",
      });
    }
    setEditingSection(section);
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditDraft({});
  };

  const saveEdit = (section: string) => {
    if (!survey) return;
    const updated = { ...survey };

    if (section === "style") {
      updated["lifestyle-4"] = editDraft.overallStyle || undefined;
      updated["lifestyle-2"] = editDraft.workStyle || undefined;
      updated["lifestyle-3"] = editDraft.weekendStyle || undefined;
      updated["colors-2"] = editDraft.printsPref || undefined;
    } else if (section === "sizing") {
      updated["sizing-1"] = {
        ...(updated["sizing-1"] || {}),
        bodyType: editDraft.bodyType,
        height: editDraft.height,
        weight: editDraft.weight,
        shirtSize: editDraft.shirtSize,
        shirtFit: editDraft.shirtFit,
        pantsWaist: editDraft.pantsWaist,
        pantsInseam: editDraft.pantsInseam,
        pantsFit: editDraft.pantsFit,
        shoeSize: editDraft.shoeSize,
      };
    } else if (section === "budget") {
      updated["basics-1"] = {
        ...(updated["basics-1"] || {}),
        ageRange: editDraft.ageRange,
        budgetMin: editDraft.budgetMin,
        budgetMax: editDraft.budgetMax,
      };
    }

    localStorage.setItem("fitted_survey", JSON.stringify(updated));
    setSurvey(updated);
    setEditingSection(null);
    setEditDraft({});
  };

  return (
    <div
      data-testid="page-profile"
      style={{
        paddingTop: 48,
        paddingBottom: 100,
        maxWidth: 900,
        margin: "0 auto",
        paddingLeft: 40,
        paddingRight: 40,
      }}
    >
      <div
        data-testid="profile-hero"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          marginBottom: 56,
          paddingBottom: 56,
          borderBottom: "1px solid var(--sand)",
          animation: "fadeUp 0.5s ease forwards",
        }}
      >
        <div
          data-testid="avatar"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "var(--charcoal)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
            fontSize: 32,
            fontWeight: 300,
            color: "var(--cream)",
            flexShrink: 0,
          }}
        >
          {firstName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div
            data-testid="text-name"
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 300,
              lineHeight: 1.1,
              marginBottom: 4,
            }}
          >
            {firstName}
          </div>
          {email && (
            <div
              data-testid="text-email"
              style={{ fontSize: 13, fontWeight: 300, color: "var(--muted)", marginBottom: 12 }}
            >
              {email}
            </div>
          )}
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Member since {memberSince}
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 20 }}>
            <div>
              <div
                data-testid="stat-looks"
                style={{
                  fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
                  fontSize: 28,
                  fontWeight: 300,
                  lineHeight: 1,
                }}
              >
                {savedLooks.length + savedBuilds.length}
              </div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginTop: 3,
                }}
              >
                Looks Saved
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileSection
        title="Style Preferences"
        delay={0.05}
        testId="section-style"
        isEditing={editingSection === "style"}
        onEdit={() => startEdit("style")}
        onSave={() => saveEdit("style")}
        onCancel={cancelEdit}
      >
        {editingSection === "style" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <EditField label="Overall Style" value={editDraft.overallStyle} onChange={(v) => setEditDraft((d) => ({ ...d, overallStyle: v }))} testId="edit-overall" />
            <EditField label="Work Style" value={editDraft.workStyle} onChange={(v) => setEditDraft((d) => ({ ...d, workStyle: v }))} testId="edit-work" />
            <EditField label="Weekend Style" value={editDraft.weekendStyle} onChange={(v) => setEditDraft((d) => ({ ...d, weekendStyle: v }))} testId="edit-weekend" />
            <EditField label="Prints & Patterns" value={editDraft.printsPref} onChange={(v) => setEditDraft((d) => ({ ...d, printsPref: v }))} testId="edit-prints" />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              background: "var(--sand)",
              border: "1px solid var(--sand)",
              marginBottom: 20,
            }}
          >
            <PrefCell label="Lifestyle" testId="pref-lifestyle">
              {lifestyle.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {lifestyle.map((l) => (
                    <PrefTag key={l}>{l}</PrefTag>
                  ))}
                </div>
              ) : (
                <PrefValue>Not set</PrefValue>
              )}
            </PrefCell>
            <PrefCell label="Overall Style" testId="pref-overall">
              <PrefValue>{overallStyle || "Not set"}</PrefValue>
            </PrefCell>
            <PrefCell label="Work Style" testId="pref-work">
              <PrefValue>{workStyle || "Not set"}</PrefValue>
            </PrefCell>
            <PrefCell label="Weekend Style" testId="pref-weekend">
              <PrefValue>{weekendStyle || "Not set"}</PrefValue>
            </PrefCell>
            <PrefCell label="Color Palettes" testId="pref-colors">
              {colorPalettes.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {colorPalettes.map((c) => (
                    <PrefTag key={c}>{c}</PrefTag>
                  ))}
                </div>
              ) : (
                <PrefValue>Not set</PrefValue>
              )}
            </PrefCell>
            <PrefCell label="Prints & Patterns" testId="pref-prints">
              <PrefValue>{printsPref || "Not set"}</PrefValue>
            </PrefCell>
            {avoidItems.length > 0 && (
              <PrefCell label="Pieces to Avoid" testId="pref-avoid" span={2}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {avoidItems.map((a) => (
                    <span
                      key={a}
                      style={{
                        fontSize: 11,
                        padding: "3px 11px",
                        background: "#fdf0e8",
                        border: "1px solid #e8c4a0",
                        color: "#8B4A2A",
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </PrefCell>
            )}
          </div>
        )}
      </ProfileSection>

      <Divider />

      <ProfileSection
        title="Sizing"
        delay={0.12}
        testId="section-sizing"
        isEditing={editingSection === "sizing"}
        onEdit={() => startEdit("sizing")}
        onSave={() => saveEdit("sizing")}
        onCancel={cancelEdit}
      >
        {editingSection === "sizing" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <EditField label="Body Type" value={editDraft.bodyType} onChange={(v) => setEditDraft((d) => ({ ...d, bodyType: v }))} testId="edit-body" />
            <EditField label="Height" value={editDraft.height} onChange={(v) => setEditDraft((d) => ({ ...d, height: v }))} testId="edit-height" />
            <EditField label="Weight (lbs)" value={editDraft.weight} onChange={(v) => setEditDraft((d) => ({ ...d, weight: v }))} testId="edit-weight" />
            <EditField label="Shirt Size" value={editDraft.shirtSize} onChange={(v) => setEditDraft((d) => ({ ...d, shirtSize: v }))} testId="edit-shirt-size" />
            <EditField label="Shirt Fit" value={editDraft.shirtFit} onChange={(v) => setEditDraft((d) => ({ ...d, shirtFit: v }))} testId="edit-shirt-fit" />
            <EditField label="Pants Waist" value={editDraft.pantsWaist} onChange={(v) => setEditDraft((d) => ({ ...d, pantsWaist: v }))} testId="edit-pants-waist" />
            <EditField label="Pants Inseam" value={editDraft.pantsInseam} onChange={(v) => setEditDraft((d) => ({ ...d, pantsInseam: v }))} testId="edit-pants-inseam" />
            <EditField label="Pants Fit" value={editDraft.pantsFit} onChange={(v) => setEditDraft((d) => ({ ...d, pantsFit: v }))} testId="edit-pants-fit" />
            <EditField label="Shoe Size" value={editDraft.shoeSize} onChange={(v) => setEditDraft((d) => ({ ...d, shoeSize: v }))} testId="edit-shoe" />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              background: "var(--sand)",
              border: "1px solid var(--sand)",
            }}
          >
            <SizingCell label="Body Type" value={sizing.bodyType || "Not set"} testId="sizing-body" />
            <SizingCell label="Height" value={sizing.height || "Not set"} testId="sizing-height" />
            <SizingCell label="Weight" value={sizing.weight ? `${sizing.weight} lbs` : "Not set"} testId="sizing-weight" />
            <SizingCell label="Shirt Size" value={sizing.shirtSize || "Not set"} sub={sizing.shirtFit} testId="sizing-shirt" />
            <SizingCell
              label="Pants"
              value={sizing.pantsWaist && sizing.pantsInseam ? `${sizing.pantsWaist} × ${sizing.pantsInseam}` : "Not set"}
              sub={sizing.pantsFit}
              testId="sizing-pants"
            />
            <SizingCell label="Shoe Size" value={sizing.shoeSize ? `${sizing.shoeSize} US` : "Not set"} testId="sizing-shoe" />
          </div>
        )}
      </ProfileSection>

      <Divider />

      <ProfileSection
        title="Budget"
        delay={0.19}
        testId="section-budget"
        isEditing={editingSection === "budget"}
        onEdit={() => startEdit("budget")}
        onSave={() => saveEdit("budget")}
        onCancel={cancelEdit}
      >
        {editingSection === "budget" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <EditField label="Age Range" value={editDraft.ageRange} onChange={(v) => setEditDraft((d) => ({ ...d, ageRange: v }))} testId="edit-age" />
            <EditField label="Budget Min ($)" value={editDraft.budgetMin} onChange={(v) => setEditDraft((d) => ({ ...d, budgetMin: v }))} testId="edit-budget-min" />
            <EditField label="Budget Max ($)" value={editDraft.budgetMax} onChange={(v) => setEditDraft((d) => ({ ...d, budgetMax: v }))} testId="edit-budget-max" />
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1,
                background: "var(--sand)",
                border: "1px solid var(--sand)",
              }}
            >
              <PrefCell label="Age Range" testId="pref-age">
                <PrefValue>{basics.ageRange || "Not set"}</PrefValue>
              </PrefCell>
              <PrefCell label="Budget Per Item" testId="pref-budget">
                <PrefValue>
                  {basics.budgetMin && basics.budgetMax
                    ? `$${basics.budgetMin} – $${basics.budgetMax}`
                    : "Not set"}
                </PrefValue>
              </PrefCell>
            </div>
            {brands.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: 8,
                  }}
                >
                  Favorite Brands
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {brands.map((b) => (
                    <PrefTag key={b}>{b}</PrefTag>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </ProfileSection>

      <Divider />

      <ProfileSection
        title="Saved Looks"
        delay={0.26}
        testId="section-looks"
        action={
          <Link
            href="/lookboard"
            data-testid="link-see-all-looks"
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--bark)",
              background: "none",
              border: "none",
              borderBottom: "1px solid var(--stone)",
              paddingBottom: 1,
              cursor: "pointer",
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              textDecoration: "none",
            }}
          >
            See All
          </Link>
        }
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 40,
              color: "var(--muted)",
            }}
          >
            <RefreshCw size={16} style={{ animation: "spin 1s linear infinite", marginRight: 8 }} />
            Loading...
          </div>
        ) : (savedLooks.length > 0 || savedBuilds.length > 0) ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
              marginBottom: 16,
            }}
            className="max-md:!grid-cols-2"
          >
            {savedBuilds.map((build) => (
              <BuildCard key={build.id} build={build} />
            ))}
            {savedLooks.map((look) => (
              <LookCard key={look.id} look={look} pieceCount={look.pieceCount} />
            ))}
          </div>
        ) : (
          <div
            data-testid="text-no-looks"
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 13,
              fontWeight: 300,
            }}
          >
            No saved looks yet. Explore looks or build your own to get started.
          </div>
        )}
      </ProfileSection>

      <Divider />

      <ProfileSection
        title="Account"
        delay={0.33}
        testId="section-account"
      >
        <div
          style={{
            padding: 24,
            border: "1px solid var(--sand)",
            background: "var(--cream)",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 18,
              fontWeight: 400,
              marginBottom: 8,
              color: "var(--charcoal)",
            }}
          >
            Retake Full Survey
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: "var(--muted)",
              lineHeight: 1.6,
              marginBottom: 16,
              maxWidth: 500,
            }}
          >
            Start fresh with a completely new style profile. This clears all your current
            preferences and takes you through the full survey again.
          </div>
          <button
            data-testid="button-retake-survey"
            onClick={handleRetakeSurvey}
            style={{
              padding: "12px 28px",
              background: "var(--charcoal)",
              color: "var(--cream)",
              border: "none",
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bark)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--charcoal)"; }}
          >
            Retake Survey
          </button>
        </div>

        <div
          style={{
            padding: 24,
            border: "1px solid #e8c4c4",
            background: "#fdf8f8",
          }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 18,
              fontWeight: 400,
              marginBottom: 8,
              color: "#8B4A2A",
            }}
          >
            Reset Style Profile
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: "var(--muted)",
              lineHeight: 1.6,
              marginBottom: 16,
              maxWidth: 500,
            }}
          >
            This will clear all your style preferences, sizing information, and saved looks.
            You&apos;ll need to complete the survey again from scratch.
          </div>
          <button
            data-testid="button-reset-profile"
            onClick={() => {
              localStorage.removeItem("fitted_survey");
              localStorage.removeItem("fitted_has_seen_welcome");
              localStorage.removeItem("fitted_saved_looks");
              localStorage.removeItem("fitted_saved_items");
              localStorage.removeItem("fitted_builds");
              document.cookie = "fitted_survey_completed=; path=/; max-age=0";
              router.push("/onboarding");
            }}
            style={{
              padding: "10px 20px",
              background: "transparent",
              color: "#8B4A2A",
              border: "1.5px solid #e8c4c4",
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fdf0e8";
              e.currentTarget.style.borderColor = "#d4a080";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#e8c4c4";
            }}
          >
            Reset Everything
          </button>
        </div>
      </ProfileSection>
    </div>
  );
}

function ProfileSection({
  title,
  delay,
  testId,
  action,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  children,
}: {
  title: string;
  delay: number;
  testId: string;
  action?: React.ReactNode;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      data-testid={testId}
      style={{
        marginBottom: 56,
        opacity: 0,
        animation: `fadeUp 0.5s ease ${delay}s forwards`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
            fontSize: 26,
            fontWeight: 400,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {action}
          {isEditing ? (
            <>
              <button
                data-testid={`button-save-${testId}`}
                onClick={onSave}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 16px",
                  background: "var(--charcoal)",
                  color: "var(--cream)",
                  border: "none",
                  fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bark)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--charcoal)")}
              >
                <Check size={12} />
                Save
              </button>
              <button
                data-testid={`button-cancel-${testId}`}
                onClick={onCancel}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 14px",
                  background: "transparent",
                  color: "var(--muted)",
                  border: "1.5px solid var(--sand)",
                  fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--stone)";
                  e.currentTarget.style.color = "var(--charcoal)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--sand)";
                  e.currentTarget.style.color = "var(--muted)";
                }}
              >
                <X size={12} />
                Cancel
              </button>
            </>
          ) : onEdit ? (
            <button
              data-testid={`button-edit-${testId}`}
              onClick={onEdit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "7px 14px",
                background: "transparent",
                color: "var(--muted)",
                border: "1.5px solid var(--sand)",
                fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--stone)";
                e.currentTarget.style.color = "var(--charcoal)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--sand)";
                e.currentTarget.style.color = "var(--muted)";
              }}
            >
              <Pencil size={11} />
              Edit
            </button>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  testId,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  testId: string;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        data-testid={testId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "1.5px solid var(--sand)",
          background: "var(--warm-white)",
          fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
          fontSize: 13,
          color: "var(--charcoal)",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--stone)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--sand)")}
      />
    </div>
  );
}

function PrefCell({
  label,
  testId,
  span,
  children,
}: {
  label: string;
  testId: string;
  span?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      data-testid={testId}
      style={{
        background: "var(--warm-white)",
        padding: "18px 22px",
        gridColumn: span ? `span ${span}` : undefined,
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function PrefValue({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, color: "var(--charcoal)", fontWeight: 400, lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

function PrefTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11,
        padding: "3px 11px",
        background: "var(--cream)",
        border: "1px solid var(--sand)",
        color: "var(--charcoal)",
      }}
    >
      {children}
    </span>
  );
}

function SizingCell({
  label,
  value,
  sub,
  testId,
}: {
  label: string;
  value: string;
  sub?: string;
  testId: string;
}) {
  return (
    <div
      data-testid={testId}
      style={{
        background: "var(--warm-white)",
        padding: "18px 22px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 15, color: "var(--charcoal)", fontWeight: 400 }}>{value}</div>
      {sub && (
        <div style={{ fontSize: 11, fontWeight: 300, color: "var(--muted)", marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--sand)", marginBottom: 56 }} />;
}

function BuildCard({ build }: { build: SavedBuild }) {
  const dateStr = new Date(build.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const brandList = Array.from(new Set(build.pieces.map((p) => p.brand))).slice(0, 2).join(", ");

  return (
    <Link
      href="/build"
      data-testid={`card-build-${build.id}`}
      style={{
        cursor: "pointer",
        transition: "transform 0.2s",
        textDecoration: "none",
        display: "block",
      }}
    >
      <div
        style={{
          height: 280,
          borderRadius: 6,
          position: "relative",
          overflow: "hidden",
          marginBottom: 10,
          background: "linear-gradient(165deg, #5C5A6E 0%, #3A3848 40%, #1E1C28 100%)",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(250,247,242,0.5)",
              marginBottom: 6,
            }}
          >
            Custom Build &middot; {dateStr}
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 20,
              fontWeight: 300,
              color: "rgba(250,247,242,0.95)",
              lineHeight: 1.2,
            }}
          >
            {build.name}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(250,247,242,0.5)",
            }}
          >
            {build.pieces.length} pieces &middot; {brandList}
          </div>
        </div>
      </div>
    </Link>
  );
}
