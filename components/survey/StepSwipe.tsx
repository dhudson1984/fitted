"use client";

import { SWIPE_LOOKS } from "@/lib/survey-data";

interface StepSwipeProps {
  reactions: Record<string, "like" | "pass">;
  onChange: (reactions: Record<string, "like" | "pass">) => void;
}

export default function StepSwipe({ reactions, onChange }: StepSwipeProps) {
  function react(id: string, reaction: "like" | "pass") {
    onChange({ ...reactions, [id]: reaction });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl" data-testid="step-swipe" style={{ animation: "fadeUp 0.4s ease both" }}>
      {SWIPE_LOOKS.map((look) => {
        const current = reactions[look.id];
        return (
          <div
            key={look.id}
            data-testid={`swipe-card-${look.id}`}
            className={`
              rounded-md border overflow-hidden transition-all duration-200
              ${current === "like" ? "border-charcoal ring-1 ring-charcoal" : current === "pass" ? "border-sand opacity-50" : "border-sand"}
            `}
            style={{ borderWidth: "1.5px" }}
          >
            <div
              className="h-48 sm:h-56 flex items-end p-4"
              style={{ background: look.gradient }}
            >
              <span className="text-white/90 text-[15px] font-medium">{look.name}</span>
            </div>
            <div className="flex">
              <button
                type="button"
                onClick={() => react(look.id, "pass")}
                data-testid={`pass-${look.id}`}
                className={`
                  flex-1 py-3 text-[14px] font-medium transition-all duration-200 flex items-center justify-center gap-2
                  ${current === "pass"
                    ? "bg-sand/60 text-charcoal"
                    : "bg-transparent text-muted hover:bg-sand/30"
                  }
                `}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Pass
              </button>
              <div className="w-px bg-sand" />
              <button
                type="button"
                onClick={() => react(look.id, "like")}
                data-testid={`like-${look.id}`}
                className={`
                  flex-1 py-3 text-[14px] font-medium transition-all duration-200 flex items-center justify-center gap-2
                  ${current === "like"
                    ? "bg-charcoal text-cream"
                    : "bg-transparent text-muted hover:bg-sand/30"
                  }
                `}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 14s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 8 4.5 3.5 3.5 0 0 1 13.5 7C13.5 10.5 8 14 8 14z" stroke="currentColor" strokeWidth="1.5" fill={current === "like" ? "currentColor" : "none"} />
                </svg>
                Like
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
