"use client";

interface IntroData {
  firstName: string;
}

interface StepIntroProps {
  data: IntroData;
  onChange: (data: IntroData) => void;
  errors?: { firstName?: string };
}

export default function StepIntro({ data, onChange, errors }: StepIntroProps) {
  return (
    <div className="max-w-md space-y-6" data-testid="step-intro" style={{ animation: "fadeUp 0.4s ease both" }}>
      <div>
        <label className="block text-[13px] font-medium text-muted mb-3">First Name</label>
        <input
          type="text"
          placeholder="Your first name"
          value={data.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
          data-testid="input-first-name"
          className="w-full px-4 py-3 rounded-md border bg-transparent text-charcoal text-[15px] focus:outline-none transition-colors"
          style={{
            borderWidth: "1.5px",
            borderColor: errors?.firstName ? "var(--bark)" : "var(--sand)",
          }}
          autoComplete="given-name"
        />
        {errors?.firstName && (
          <p
            data-testid="error-first-name"
            className="font-body"
            style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}
          >
            {errors.firstName}
          </p>
        )}
      </div>
    </div>
  );
}
