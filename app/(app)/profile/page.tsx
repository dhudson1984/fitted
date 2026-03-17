"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RefreshCw, Pencil, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Look } from "@/lib/types";
import LookCard from "@/components/app/LookCard";

const PROFILE_HEIGHTS = Array.from({ length: 19 }, (_, i) => {
  const totalInches = 60 + i;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}"`;
});
const PROFILE_WEIGHTS = Array.from({ length: 33 }, (_, i) => `${120 + i * 5} lbs`);
const PROFILE_PANTS_WAISTS = Array.from({ length: 15 }, (_, i) => `${28 + i}`);
const PROFILE_PANTS_INSEAMS = ["28", "29", "30", "31", "32", "33", "34", "36"];
const PROFILE_SHOE_SIZES = Array.from({ length: 17 }, (_, i) => {
  const size = 7 + i * 0.5;
  return `${size}`;
});

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
  thumbnail?: string | null;
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
  const [editLifestyle, setEditLifestyle] = useState<string[]>([]);

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
      setEditLifestyle([...lifestyle]);
      setEditDraft({
        overallStyle: overallStyle || "",
        workStyle: workStyle || "",
        weekendStyle: weekendStyle || "",
        fitPref: sizing.shirtFit || sizing.pantsFit || "",
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
    setEditLifestyle([]);
  };

  const saveEdit = (section: string) => {
    if (!survey) return;
    const updated = { ...survey };

    if (section === "style") {
      updated["lifestyle-1"] = editLifestyle;
      updated.lifestyle = editLifestyle;
      updated["lifestyle-4"] = editDraft.overallStyle || undefined;
      updated["lifestyle-2"] = editDraft.workStyle || undefined;
      updated["lifestyle-3"] = editDraft.weekendStyle || undefined;
      updated["colors-2"] = editDraft.printsPref || undefined;
      updated["sizing-1"] = {
        ...(updated["sizing-1"] || {}),
        shirtFit: editDraft.fitPref || "",
        pantsFit: editDraft.fitPref || "",
      };
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
    setEditLifestyle([]);
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
          <div style={{ marginBottom: 20 }}>
            <CheckboxGroup
              label="Lifestyle Categories"
              options={["Work", "Smart Casual", "Night Out", "Athletic & Outdoors"]}
              selected={editLifestyle}
              onChange={setEditLifestyle}
              testId="edit-lifestyle"
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginTop: 16,
              }}
            >
              <SelectField label="Overall Style" value={editDraft.overallStyle} onChange={(v) => setEditDraft((d) => ({ ...d, overallStyle: v }))} options={["Classic & Clean", "Relaxed & Casual", "Sharp & Polished", "Streetwear Influenced"]} testId="edit-overall" />
              <SelectField label="Work Style" value={editDraft.workStyle} onChange={(v) => setEditDraft((d) => ({ ...d, workStyle: v }))} options={["Polished & Formal", "Elevated Casual", "Relaxed Professional"]} testId="edit-work" />
              <SelectField label="Weekend Vibe" value={editDraft.weekendStyle} onChange={(v) => setEditDraft((d) => ({ ...d, weekendStyle: v }))} options={["Timeless", "Sharp", "Effortless"]} testId="edit-weekend" />
              <SelectField label="Fit Preference" value={editDraft.fitPref} onChange={(v) => setEditDraft((d) => ({ ...d, fitPref: v }))} options={["Slim", "Regular", "Relaxed"]} testId="edit-fit" />
              <SelectField label="Prints & Patterns" value={editDraft.printsPref} onChange={(v) => setEditDraft((d) => ({ ...d, printsPref: v }))} options={["Love Them", "Open to Them", "Keep It Simple"]} testId="edit-prints" />
            </div>
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
            <PrefCell label="Weekend Vibe" testId="pref-weekend">
              <PrefValue>{weekendStyle || "Not set"}</PrefValue>
            </PrefCell>
            <PrefCell label="Fit Preference" testId="pref-fit">
              <PrefValue>{sizing.shirtFit || sizing.pantsFit || "Not set"}</PrefValue>
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
            <SelectField label="Body Type" value={editDraft.bodyType} onChange={(v) => setEditDraft((d) => ({ ...d, bodyType: v }))} options={["Slim", "Average", "Athletic", "Broad"]} testId="edit-body" />
            <SelectField label="Height" value={editDraft.height} onChange={(v) => setEditDraft((d) => ({ ...d, height: v }))} options={PROFILE_HEIGHTS} testId="edit-height" />
            <SelectField label="Weight" value={editDraft.weight} onChange={(v) => setEditDraft((d) => ({ ...d, weight: v }))} options={PROFILE_WEIGHTS} testId="edit-weight" />
            <SelectField label="Shirt Size" value={editDraft.shirtSize} onChange={(v) => setEditDraft((d) => ({ ...d, shirtSize: v }))} options={["XS", "S", "M", "L", "XL", "XXL"]} testId="edit-shirt-size" />
            <SelectField label="Shirt Fit" value={editDraft.shirtFit} onChange={(v) => setEditDraft((d) => ({ ...d, shirtFit: v }))} options={["Slim", "Regular", "Relaxed"]} testId="edit-shirt-fit" />
            <SelectField label="Pants Waist" value={editDraft.pantsWaist} onChange={(v) => setEditDraft((d) => ({ ...d, pantsWaist: v }))} options={PROFILE_PANTS_WAISTS} testId="edit-pants-waist" />
            <SelectField label="Pants Inseam" value={editDraft.pantsInseam} onChange={(v) => setEditDraft((d) => ({ ...d, pantsInseam: v }))} options={PROFILE_PANTS_INSEAMS} testId="edit-pants-inseam" />
            <SelectField label="Pants Fit" value={editDraft.pantsFit} onChange={(v) => setEditDraft((d) => ({ ...d, pantsFit: v }))} options={["Slim", "Straight", "Relaxed"]} testId="edit-pants-fit" />
            <SelectField label="Shoe Size" value={editDraft.shoeSize} onChange={(v) => setEditDraft((d) => ({ ...d, shoeSize: v }))} options={PROFILE_SHOE_SIZES} testId="edit-shoe" />
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
            <SizingCell label="Weight" value={sizing.weight ? (sizing.weight.includes("lbs") ? sizing.weight : `${sizing.weight} lbs`) : "Not set"} testId="sizing-weight" />
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
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <SelectField label="Age Range" value={editDraft.ageRange} onChange={(v) => setEditDraft((d) => ({ ...d, ageRange: v }))} options={["18–24", "25–34", "35–44", "45–54", "55+"]} testId="edit-age" />
            <SelectField
              label="Per Item Budget — Min"
              value={editDraft.budgetMin || ""}
              onChange={(v) => setEditDraft((d) => ({ ...d, budgetMin: v }))}
              options={["Under $50", "$50–$100", "$100–$150", "$150–$200", "$200–$300", "$300–$500", "$500+"]}
              testId="edit-budget-min"
            />
            <SelectField
              label="Per Item Budget — Max"
              value={editDraft.budgetMax || ""}
              onChange={(v) => setEditDraft((d) => ({ ...d, budgetMax: v }))}
              options={["Under $50", "$50–$100", "$100–$150", "$150–$200", "$200–$300", "$300–$500", "$500+"]}
              testId="edit-budget-max"
            />
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
              <PrefCell label="Per Item Budget" testId="pref-budget">
                <PrefValue>
                  {basics.budgetMin && basics.budgetMax
                    ? `${basics.budgetMin} – ${basics.budgetMax}`
                    : basics.budgetMin || basics.budgetMax || "Not set"}
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

function SelectField({
  label,
  value,
  onChange,
  options,
  testId,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
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
      <select
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "1.5px solid var(--sand)",
          background: "var(--warm-white)",
          fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
          fontSize: 13,
          color: value ? "var(--charcoal)" : "var(--muted)",
          outline: "none",
          transition: "border-color 0.2s",
          cursor: "pointer",
          appearance: "none",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: 32,
        }}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
  testId,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  testId: string;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div data-testid={testId}>
      <label
        style={{
          display: "block",
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 10,
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              data-testid={`checkbox-${opt.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
              onClick={() => toggle(opt)}
              style={{
                padding: "8px 16px",
                border: `1.5px solid ${active ? "var(--charcoal)" : "var(--sand)"}`,
                background: active ? "var(--charcoal)" : "var(--warm-white)",
                color: active ? "var(--cream)" : "var(--charcoal)",
                fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
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
      href={`/builds/${build.id}`}
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
        {build.thumbnail && (
          <img
            src={build.thumbnail}
            alt={build.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.35,
            }}
          />
        )}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(250,247,242,0.5)",
              marginBottom: 6,
            }}
          >
            Your Build &middot; {dateStr}
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
        <div style={{ position: "relative", zIndex: 1 }}>
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
