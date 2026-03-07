"use client";

interface IntroData {
  firstName: string;
  email: string;
}

interface StepIntroProps {
  data: IntroData;
  onChange: (data: IntroData) => void;
}

export default function StepIntro({ data, onChange }: StepIntroProps) {
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
          className="w-full px-4 py-3 rounded-md border border-sand bg-transparent text-charcoal text-[15px] focus:outline-none focus:border-charcoal transition-colors"
          style={{ borderWidth: "1.5px" }}
          autoComplete="given-name"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-muted mb-3">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          data-testid="input-email"
          className="w-full px-4 py-3 rounded-md border border-sand bg-transparent text-charcoal text-[15px] focus:outline-none focus:border-charcoal transition-colors"
          style={{ borderWidth: "1.5px" }}
          autoComplete="email"
        />
      </div>
    </div>
  );
}
