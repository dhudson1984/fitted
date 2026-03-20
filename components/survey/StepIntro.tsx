"use client";

interface IntroData {
  firstName: string;
  email: string;
}

interface StepIntroProps {
  data: IntroData;
  onChange: (data: IntroData) => void;
  errors?: { firstName?: string; email?: string };
}

export default function StepIntro({ data, onChange, errors }: StepIntroProps) {
  function update(field: keyof IntroData, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="max-w-md space-y-6" data-testid="step-intro" style={{ animation: "fadeUp 0.4s ease both" }}>
      <div>
        <label className="block text-[13px] font-medium text-muted mb-3">First Name</label>
        <input
          type="text"
          placeholder="Your first name"
          value={data.firstName}
          onChange={(e) => update("firstName", e.target.value)}
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

      <div>
        <label className="block text-[13px] font-medium text-muted mb-3">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          data-testid="input-email"
          className="w-full px-4 py-3 rounded-md border bg-transparent text-charcoal text-[15px] focus:outline-none transition-colors"
          style={{
            borderWidth: "1.5px",
            borderColor: errors?.email ? "var(--bark)" : "var(--sand)",
          }}
          autoComplete="email"
        />
        {errors?.email && (
          <p
            data-testid="error-email"
            className="font-body"
            style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}
          >
            {errors.email}
          </p>
        )}
      </div>
    </div>
  );
}
