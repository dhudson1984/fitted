"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { getActiveSteps } from "@/lib/survey-data";
import SurveySidebar from "./SurveySidebar";
import StepIntro from "./StepIntro";
import StepMultiSelect from "./StepMultiSelect";
import StepPalette from "./StepPalette";
import StepAvoid from "./StepAvoid";
import StepSizing from "./StepSizing";
import StepBasics from "./StepBasics";
import StepBrands from "./StepBrands";
import StepSwipe from "./StepSwipe";

export default function SurveyShell() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());
  const [lifestyle, setLifestyle] = useState<Set<string>>(new Set());
  const [selections, setSelections] = useState<Record<string, unknown>>({});
  const [completed, setCompleted] = useState(false);

  const active = useMemo(() => getActiveSteps(lifestyle), [lifestyle]);
  const total = active.length;
  const step = active[current];

  useEffect(() => {
    if (step) {
      setVisitedIds((prev) => new Set(prev).add(step.id));
    }
  }, [step]);

  useEffect(() => {
    if (current >= total && total > 0) {
      setCurrent(total - 1);
    }
  }, [current, total]);

  const visited = useMemo(() => {
    const set = new Set<number>();
    active.forEach((s, i) => {
      if (visitedIds.has(s.id)) set.add(i);
    });
    return set;
  }, [active, visitedIds]);

  const updateSelection = useCallback(
    (stepId: string, value: unknown) => {
      setSelections((prev) => ({ ...prev, [stepId]: value }));
      if (stepId === "lifestyle-1") {
        const arr = value as string[];
        setLifestyle(new Set(arr));
      }
    },
    []
  );

  const goNext = useCallback(() => {
    if (current >= total - 1) {
      setCompleted(true);
      return;
    }
    setCurrent(current + 1);
  }, [current, total]);

  const goBack = useCallback(() => {
    if (current > 0) setCurrent(current - 1);
  }, [current]);

  const navigateTo = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < total) {
        setCurrent(idx);
      }
    },
    [total]
  );

  const handleFinish = useCallback(() => {
    try {
      const introData = selections["intro-1"] as { firstName?: string; email?: string } | undefined;
      const firstName = (introData?.firstName || "").trim();
      const email = (introData?.email || "").trim();
      localStorage.setItem("fitted_survey", JSON.stringify({
        ...selections,
        firstName,
        email,
        lifestyle: Array.from(lifestyle),
        completedAt: new Date().toISOString(),
      }));
    } catch {}
    router.push("/dashboard");
  }, [selections, lifestyle, router]);

  if (completed) {
    return (
      <div
        data-testid="survey-complete"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: 48,
          background: "var(--warm-white)",
          animation: "fadeUp 0.6s ease",
        }}
      >
        <div
          data-testid="complete-mark"
          style={{
            width: 64,
            height: 64,
            border: "1px solid var(--stone)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <Check size={24} style={{ color: "var(--bark)" }} />
        </div>
        <h2
          data-testid="text-complete-title"
          className="font-display"
          style={{ fontSize: 42, fontWeight: 300, marginBottom: 10 }}
        >
          Your profile is ready.
        </h2>
        <p
          data-testid="text-complete-sub"
          className="font-body"
          style={{
            fontSize: 14,
            fontWeight: 300,
            color: "var(--muted)",
            lineHeight: 1.7,
            maxWidth: 380,
            marginBottom: 36,
          }}
        >
          We&apos;ve built your style profile. Time to explore looks curated just for you.
        </p>
        <button
          data-testid="button-go-dashboard"
          className="font-body"
          onClick={handleFinish}
          style={{
            padding: "16px 44px",
            background: "var(--charcoal)",
            color: "var(--cream)",
            border: "none",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bark)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--charcoal)")}
        >
          Go to My Dashboard →
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--warm-white)" }}>
      <SurveySidebar
        current={current}
        visited={visited}
        lifestyle={lifestyle}
        onNavigate={navigateTo}
      />
      <div
        style={{
          marginLeft: 260,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
        className="max-md:!ml-0"
      >
        <div
          data-testid="survey-top-bar"
          style={{
            height: 60,
            borderBottom: "1px solid var(--sand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 48px",
          }}
          className="max-md:!px-5"
        >
          <span
            data-testid="text-step-label"
            className="font-body"
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Step {current + 1} of {total}
          </span>
        </div>

        <div
          key={step?.id}
          data-testid={`step-${step?.id}`}
          style={{
            flex: 1,
            padding: "64px 48px",
            maxWidth: 680,
            animation: "fadeUp 0.4s ease",
            display: "flex",
            flexDirection: "column",
          }}
          className="max-md:!px-5 max-md:!py-8 max-md:!max-w-full"
        >
          {step && (
            <>
              <p
                className="font-body"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--bark)",
                  marginBottom: 12,
                }}
              >
                {step.eyebrow}
              </p>
              <h2
                data-testid="text-step-question"
                className="font-display"
                style={{
                  fontSize: "clamp(26px,3vw,38px)",
                  fontWeight: 300,
                  lineHeight: 1.2,
                  marginBottom: step.hint ? 8 : 40,
                  color: "var(--charcoal)",
                }}
              >
                {step.question}
              </h2>
              {step.hint && (
                <p
                  className="font-body"
                  style={{
                    fontSize: 13,
                    fontWeight: 300,
                    color: "var(--muted)",
                    marginBottom: 40,
                    lineHeight: 1.6,
                  }}
                >
                  {step.hint}
                </p>
              )}

              {step.type === "intro" && (
                <StepIntro
                  data={
                    (selections[step.id] as { firstName: string; email: string }) || {
                      firstName: "",
                      email: "",
                    }
                  }
                  onChange={(val) => updateSelection(step.id, val)}
                />
              )}
              {(step.type === "multi" || step.type === "single") && step.options && (
                <StepMultiSelect
                  options={step.options}
                  selected={((selections[step.id] as string[]) || [])}
                  onChange={(val) => updateSelection(step.id, val)}
                  multi={step.type === "multi"}
                />
              )}
              {step.type === "palette" && (
                <StepPalette
                  selected={((selections[step.id] as string[]) || [])}
                  onChange={(val) => updateSelection(step.id, val)}
                />
              )}
              {step.type === "avoid" && (
                <StepAvoid
                  data={(selections[step.id] as { items: string[]; trustStylist: boolean }) || { items: [], trustStylist: false }}
                  onChange={(val) => updateSelection(step.id, val)}
                />
              )}
              {step.type === "sizing" && (
                <StepSizing
                  data={(selections[step.id] as Record<string, string>) || {}}
                  onChange={(val) => updateSelection(step.id, val)}
                />
              )}
              {step.type === "basics" && (
                <StepBasics
                  data={
                    (selections[step.id] as { ageRange: string; budgetMin: string; budgetMax: string }) || {
                      ageRange: "",
                      budgetMin: "",
                      budgetMax: "",
                    }
                  }
                  onChange={(val) => updateSelection(step.id, val)}
                />
              )}
              {step.type === "brands" && (
                <StepBrands
                  selected={((selections[step.id] as string[]) || [])}
                  onChange={(val) => updateSelection(step.id, val)}
                />
              )}
              {step.type === "swipe" && (
                <StepSwipe
                  reactions={((selections[step.id] as Record<string, "like" | "pass">) || {})}
                  onChange={(val) => updateSelection(step.id, val)}
                />
              )}
            </>
          )}
        </div>

        <div
          data-testid="survey-nav"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "24px 48px",
            borderTop: "1px solid var(--sand)",
            marginTop: "auto",
          }}
          className="max-md:!px-5"
        >
          <button
            data-testid="button-back"
            className="font-body"
            onClick={goBack}
            disabled={current === 0}
            style={{
              padding: "12px 28px",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: current === 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              border: "1.5px solid var(--sand)",
              background: "var(--warm-white)",
              color: "var(--charcoal)",
              opacity: current === 0 ? 0.3 : 1,
            }}
          >
            ← Back
          </button>
          <button
            data-testid="button-next"
            className="font-body"
            onClick={goNext}
            style={{
              padding: "12px 28px",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
              border: "none",
              background: "var(--charcoal)",
              color: "var(--cream)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bark)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--charcoal)")}
          >
            {current === total - 1 ? "Finish →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
