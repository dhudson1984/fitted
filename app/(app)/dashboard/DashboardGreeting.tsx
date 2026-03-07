"use client";

import { useState, useEffect } from "react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getName(): string {
  try {
    const survey = localStorage.getItem("fitted_survey");
    if (survey) {
      const parsed = JSON.parse(survey);
      if (parsed.firstName) return parsed.firstName;
    }
  } catch {}
  return "there";
}

export default function DashboardGreeting() {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("there");

  useEffect(() => {
    setMounted(true);
    setName(getName());
  }, []);

  if (!mounted) {
    return (
      <div className="mb-10">
        <h1
          data-testid="text-greeting"
          className="font-display text-4xl md:text-5xl font-light tracking-wide mb-1"
          style={{ color: "var(--charcoal)" }}
        >
          &nbsp;
        </h1>
        <p
          data-testid="text-greeting-date"
          className="text-sm font-light"
          style={{ color: "var(--muted)" }}
        >
          &nbsp;
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10" style={{ animation: "fadeUp 0.5s ease-out" }}>
      <h1
        data-testid="text-greeting"
        className="font-display text-4xl md:text-5xl font-light tracking-wide mb-1"
        style={{ color: "var(--charcoal)" }}
      >
        {getGreeting()}, {name}
      </h1>
      <p
        data-testid="text-greeting-date"
        className="text-sm font-light"
        style={{ color: "var(--muted)" }}
      >
        {formatDate()} &mdash; Let&apos;s find your look.
      </p>
    </div>
  );
}
