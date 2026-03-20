"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatSignInError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials") || m.includes("email not confirmed")) {
    return "Incorrect email or password. Please try again.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Too many attempts. Please try again in a few minutes.";
  }
  if (m.includes("network") || m.includes("fetch")) {
    return "Network error. Please check your connection and try again.";
  }
  return "Incorrect email or password. Please try again.";
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setEmailError("");
      setPasswordError("");
      setServerError("");
      setLoading(false);
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setServerError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasError = false;

    if (!email.trim()) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setServerError(formatSignInError(signInError.message));
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setServerError("Sign in failed. Please try again.");
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("[SignIn] user id:", user.id);
      console.log("[SignIn] profile row:", profile);
      console.log("[SignIn] profile error:", profileError);

      if (profile) {
        try {
          // Restore name
          const firstName = profile.first_name || "";
          console.log("[SignIn] first_name:", firstName);
          if (firstName) localStorage.setItem("userName", firstName);

          const sd = (profile.survey_data || {}) as Record<string, unknown>;
          console.log("[SignIn] survey_data keys:", Object.keys(sd));

          // Restore full survey object — DashboardGreeting reads fitted_survey.firstName
          if (sd.survey) {
            const surveyObj = sd.survey as Record<string, unknown>;
            // Ensure firstName is present in the survey object
            if (firstName && !surveyObj.firstName) surveyObj.firstName = firstName;
            localStorage.setItem("fitted_survey", JSON.stringify(surveyObj));
            console.log("[SignIn] restored fitted_survey, firstName:", surveyObj.firstName);
          } else if (firstName) {
            // No survey stored — at minimum write a stub so the greeting works
            localStorage.setItem("fitted_survey", JSON.stringify({ firstName }));
            console.log("[SignIn] wrote stub fitted_survey with firstName:", firstName);
          }

          if (sd.savedLooks) localStorage.setItem("fitted_saved_looks", JSON.stringify(sd.savedLooks));
          if (sd.savedItems) localStorage.setItem("fitted_saved_items", JSON.stringify(sd.savedItems));
          if (sd.builds) localStorage.setItem("fitted_builds", JSON.stringify(sd.builds));
        } catch (restoreErr) {
          console.error("[SignIn] error restoring profile data:", restoreErr);
        }
      } else {
        // No profile row — use email-derived name as last resort
        const fallbackName = user.email ? user.email.split("@")[0] : "";
        console.log("[SignIn] no profile row, fallback name:", fallbackName);
        if (fallbackName) {
          localStorage.setItem("userName", fallbackName);
          localStorage.setItem("fitted_survey", JSON.stringify({ firstName: fallbackName }));
        }
      }

      document.cookie = "fitted_survey_completed=true; path=/; max-age=31536000";
      await fetch("/api/survey/complete", { method: "POST" });

      onClose();
      router.push("/dashboard");
    } catch {
      setServerError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    background: "transparent",
    fontSize: 14,
    color: "var(--charcoal)",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <div
      data-testid="sign-in-modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(26,26,24,0.55)",
          animation: "fadeIn 0.25s ease",
        }}
        onClick={onClose}
      />

      <div
        data-testid="sign-in-modal-content"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 400,
          background: "var(--warm-white)",
          padding: "48px 40px 40px",
          animation: "fadeUp 0.35s ease",
        }}
      >
        <button
          data-testid="button-sign-in-close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--muted)",
            transition: "color 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
          }}
          aria-label="Close"
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          <X size={18} />
        </button>

        <p
          className="font-display"
          style={{
            fontSize: 9,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--bark)",
            marginBottom: 20,
          }}
        >
          Fitted
        </p>

        <h2
          data-testid="text-sign-in-title"
          className="font-display"
          style={{
            fontSize: 26,
            fontWeight: 300,
            color: "var(--charcoal)",
            lineHeight: 1.2,
            marginBottom: 32,
          }}
        >
          Welcome back.
        </h2>

        <form noValidate onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label
              className="font-body"
              style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 6 }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); setServerError(""); }}
              data-testid="input-sign-in-email"
              placeholder="you@example.com"
              autoComplete="email"
              className="font-body"
              style={{
                ...inputBase,
                border: `1.5px solid ${emailError ? "var(--bark)" : "var(--sand)"}`,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--charcoal)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = emailError ? "var(--bark)" : "var(--sand)")}
            />
            {emailError && (
              <p data-testid="text-sign-in-email-error" className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginTop: 5 }}>
                {emailError}
              </p>
            )}
          </div>

          <div>
            <label
              className="font-body"
              style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 6 }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(""); setServerError(""); }}
              data-testid="input-sign-in-password"
              placeholder="Your password"
              autoComplete="current-password"
              className="font-body"
              style={{
                ...inputBase,
                border: `1.5px solid ${passwordError ? "var(--bark)" : "var(--sand)"}`,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--charcoal)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = passwordError ? "var(--bark)" : "var(--sand)")}
            />
            {passwordError && (
              <p data-testid="text-sign-in-password-error" className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginTop: 5 }}>
                {passwordError}
              </p>
            )}
          </div>

          {serverError && (
            <p
              data-testid="text-sign-in-error"
              className="font-body"
              style={{ fontSize: 12, color: "var(--muted)", marginTop: -2 }}
            >
              {serverError}
            </p>
          )}

          <button
            type="submit"
            data-testid="button-sign-in-submit"
            disabled={loading}
            className="font-body"
            style={{
              width: "100%",
              padding: "14px 24px",
              background: loading ? "var(--stone)" : "var(--charcoal)",
              color: "var(--cream)",
              border: "none",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              marginTop: 8,
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--bark)"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--charcoal)"; }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p
          className="font-body"
          style={{
            fontSize: 12,
            color: "var(--muted)",
            textAlign: "center",
            marginTop: 24,
          }}
        >
          Don&apos;t have an account?{" "}
          <button
            data-testid="link-sign-in-get-started"
            onClick={() => { onClose(); router.push("/onboarding"); }}
            className="font-body"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontSize: 12,
              color: "var(--bark)",
              cursor: "pointer",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Get Started
          </button>
        </p>
      </div>
    </div>
  );
}
