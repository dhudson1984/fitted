"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Settings, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Look } from "@/lib/types";
import { getGradient } from "@/lib/types";

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

export default function ProfilePage() {
  const router = useRouter();
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [savedLooks, setSavedLooks] = useState<LookWithPieceCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fitted_survey");
      if (raw) setSurvey(JSON.parse(raw));
    } catch {}

    async function fetchLooks() {
      const { data: looks } = await supabase
        .from("looks")
        .select("*")
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

  const handleResetSurvey = () => {
    localStorage.removeItem("fitted_survey");
    localStorage.removeItem("fitted_has_seen_welcome");
    router.push("/onboarding");
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
                {savedLooks.length}
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
      >
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
        <div style={{ display: "flex", gap: 12 }}>
          <button
            data-testid="button-edit-preferences"
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
            onClick={handleResetSurvey}
          >
            Edit Preferences
          </button>
          <button
            data-testid="button-new-survey"
            style={{
              padding: "12px 24px",
              background: "var(--warm-white)",
              color: "var(--charcoal)",
              border: "1.5px solid var(--sand)",
              fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--stone)";
              e.currentTarget.style.background = "var(--cream)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--sand)";
              e.currentTarget.style.background = "var(--warm-white)";
            }}
            onClick={handleResetSurvey}
          >
            Start New Survey
          </button>
        </div>
      </ProfileSection>

      <Divider />

      <ProfileSection
        title="Sizing"
        delay={0.12}
        testId="section-sizing"
      >
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
      </ProfileSection>

      <Divider />

      <ProfileSection
        title="Budget"
        delay={0.19}
        testId="section-budget"
      >
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
      </ProfileSection>

      <Divider />

      <ProfileSection
        title="Saved Looks"
        delay={0.26}
        testId="section-looks"
        action={
          <Link
            href="/explore"
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
        ) : savedLooks.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
              marginBottom: 16,
            }}
          >
            {savedLooks.map((look) => (
              <LookCard key={look.id} look={look} />
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
            No saved looks yet. Explore looks to get started.
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
            This will clear all your style preferences and sizing information. You&apos;ll be taken
            through the onboarding survey again from scratch.
          </div>
          <button
            data-testid="button-reset-profile"
            onClick={handleResetSurvey}
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
            Start New Survey
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
  children,
}: {
  title: string;
  delay: number;
  testId: string;
  action?: React.ReactNode;
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
          alignItems: "baseline",
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
        {action}
      </div>
      {children}
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

function LookCard({ look }: { look: LookWithPieceCount }) {
  const gradient = getGradient(look);

  return (
    <Link
      href={`/looks/${look.slug}`}
      data-testid={`card-look-${look.id}`}
      style={{
        cursor: "pointer",
        transition: "transform 0.2s",
        textDecoration: "none",
        display: "block",
      }}
    >
      <div
        style={{
          aspectRatio: "4/3",
          position: "relative",
          overflow: "hidden",
          marginBottom: 10,
        }}
      >
        {look.image_url ? (
          <img
            src={look.image_url}
            alt={look.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: gradient,
              transition: "transform 0.4s",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(26,26,24,0.65) 0%, transparent 50%)",
            padding: 14,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--stone)",
              marginBottom: 3,
            }}
          >
            {look.category}
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 16,
              fontWeight: 400,
              color: "var(--cream)",
            }}
          >
            {look.name}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 300, color: "var(--muted)" }}>
        {look.pieceCount} pieces
      </div>
    </Link>
  );
}

function extractValue(val: string | string[] | Record<string, string> | undefined): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val[0] || "";
  return "";
}
