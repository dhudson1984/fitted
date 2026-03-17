"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const active = useMemo(() => getActiveSteps(lifestyle), [lifestyle]);
  const total = active.length;
  const step = active[current];

  useEffect(() => {
    if (step) {
      setVisitedIds((prev) => new Set(prev).add(step.id));
    }
  }, [step]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [current]);

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

  const handleFinish = useCallback(() => {
    document.cookie = "fitted_survey_completed=true; path=/; max-age=31536000; SameSite=Lax";
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
      if (firstName) {
        localStorage.setItem("userName", firstName);
      }
      localStorage.removeItem("fitted_has_seen_welcome");
    } catch {}
    window.location.href = "/dashboard";
  }, [selections, lifestyle]);

  const goNext = useCallback(() => {
    if (current >= total - 1) {
      handleFinish();
      return;
    }
    setCurrent(current + 1);
  }, [current, total, handleFinish]);

  const goBack = useCallback(() => {
    if (current === 0) {
      router.push("/");
    } else {
      setCurrent(current - 1);
    }
  }, [current, router]);

  const navigateTo = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < total) {
        setCurrent(idx);
      }
    },
    [total]
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--warm-white)", width: "100%", overflowX: "hidden" }}>
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
          minWidth: 0,
          width: "100%",
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
          className="max-md:!px-5 max-md:!pt-8 max-md:!pb-[88px] max-md:!max-w-full"
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
          className="max-md:!fixed max-md:!bottom-0 max-md:!left-0 max-md:!right-0 max-md:!px-5 max-md:!bg-[var(--warm-white)] max-md:!z-50 max-md:!border-t max-md:!border-sand max-md:!py-4 max-md:!mt-0"
        >
          <button
            data-testid="button-back"
            className="font-body"
            onClick={goBack}
            style={{
              padding: "12px 28px",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
              border: "1.5px solid var(--sand)",
              background: "var(--warm-white)",
              color: "var(--charcoal)",
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
