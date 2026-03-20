"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SaveProfileModalProps {
  isOpen: boolean;
  email: string;
  onDone: () => void;
}

export default function SaveProfileModal({ isOpen, email, onDone }: SaveProfileModalProps) {
  const [emailValue, setEmailValue] = useState(email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onDone(); },
    [onDone]
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setConfirmError("");
    setServerError("");

    const trimmedEmail = emailValue.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasError = false;

    if (!trimmedEmail) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!emailRegex.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      hasError = true;
    }
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      hasError = true;
    }
    if (hasError) return;

    console.log("[SaveProfileModal] submitting signup for:", trimmedEmail);
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      });

      console.log("[SaveProfileModal] signUp result:", { data, signUpError });

      if (signUpError) {
        console.error("[SaveProfileModal] signUp error:", signUpError);
        if (signUpError.message.toLowerCase().includes("already registered")) {
          setServerError("An account with this email already exists. Sign in instead.");
        } else {
          setServerError(signUpError.message || "Sign up failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      const user = data.user;
      console.log("[SaveProfileModal] user created:", user?.id);

      if (user) {
        let surveyPayload: Record<string, unknown> = {};
        try {
          const rawSurvey = localStorage.getItem("fitted_survey");
          const rawSavedLooks = localStorage.getItem("fitted_saved_looks");
          const rawSavedItems = localStorage.getItem("fitted_saved_items");
          const rawBuilds = localStorage.getItem("fitted_builds");
          surveyPayload = {
            survey: rawSurvey ? JSON.parse(rawSurvey) : null,
            savedLooks: rawSavedLooks ? JSON.parse(rawSavedLooks) : [],
            savedItems: rawSavedItems ? JSON.parse(rawSavedItems) : [],
            builds: rawBuilds ? JSON.parse(rawBuilds) : [],
          };
        } catch {}

        const firstName = (() => {
          try {
            const s = JSON.parse(localStorage.getItem("fitted_survey") || "{}");
            return s.firstName || s["intro-1"]?.firstName || "";
          } catch { return ""; }
        })();

        const { error: upsertError } = await supabase.from("user_profiles").upsert({
          id: user.id,
          email: trimmedEmail,
          first_name: firstName,
          survey_data: surveyPayload,
        });
        console.log("[SaveProfileModal] upsert result:", { upsertError });
      }

      setDone(true);
      setTimeout(() => onDone(), 1800);
    } catch (err) {
      console.error("[SaveProfileModal] unexpected error:", err);
      setServerError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid var(--sand)",
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
      data-testid="save-profile-modal"
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
        onClick={onDone}
      />

      <div
        data-testid="save-profile-modal-content"
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
          data-testid="button-save-profile-close"
          onClick={onDone}
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

        {done ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--charcoal)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Check size={22} color="var(--cream)" />
            </div>
            <h2
              className="font-display"
              style={{ fontSize: 24, fontWeight: 300, color: "var(--charcoal)", marginBottom: 8 }}
            >
              Profile saved.
            </h2>
            <p className="font-body" style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {emailValue.includes("@") && !emailValue.startsWith("user")
                ? "Check your inbox to confirm your email."
                : "You're all set."}
            </p>
          </div>
        ) : (
          <>
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
              Optional
            </p>

            <h2
              data-testid="text-save-profile-title"
              className="font-display"
              style={{
                fontSize: 26,
                fontWeight: 300,
                color: "var(--charcoal)",
                lineHeight: 1.2,
                marginBottom: 10,
              }}
            >
              Save your profile.
            </h2>

            <p
              className="font-body"
              style={{
                fontSize: 13,
                fontWeight: 300,
                color: "var(--muted)",
                lineHeight: 1.6,
                marginBottom: 28,
              }}
            >
              Create a password to access your style profile across devices.
            </p>

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
                  value={emailValue}
                  onChange={(e) => { setEmailValue(e.target.value); setEmailError(""); }}
                  data-testid="input-save-profile-email"
                  autoComplete="email"
                  className="font-body"
                  style={{ ...inputStyle, borderColor: emailError ? "var(--bark)" : "var(--sand)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--charcoal)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = emailError ? "var(--bark)" : "var(--sand)")}
                />
                {emailError && (
                  <p data-testid="text-save-profile-email-error" className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginTop: 5 }}>
                    {emailError}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="font-body"
                  style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 6 }}
                >
                  Create Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                  data-testid="input-save-profile-password"
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className="font-body"
                  style={{ ...inputStyle, borderColor: passwordError ? "var(--bark)" : "var(--sand)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--charcoal)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = passwordError ? "var(--bark)" : "var(--sand)")}
                />
                {passwordError && (
                  <p data-testid="text-save-profile-password-error" className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginTop: 5 }}>
                    {passwordError}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="font-body"
                  style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 6 }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(""); }}
                  data-testid="input-save-profile-confirm"
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className="font-body"
                  style={{ ...inputStyle, borderColor: confirmError ? "var(--bark)" : "var(--sand)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--charcoal)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = confirmError ? "var(--bark)" : "var(--sand)")}
                />
                {confirmError && (
                  <p data-testid="text-save-profile-confirm-error" className="font-body" style={{ fontSize: 12, color: "var(--muted)", marginTop: 5 }}>
                    {confirmError}
                  </p>
                )}
              </div>

              {serverError && (
                <p
                  data-testid="text-save-profile-error"
                  className="font-body"
                  style={{ fontSize: 12, color: "var(--muted)" }}
                >
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                data-testid="button-save-profile-submit"
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
                  marginTop: 4,
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--bark)"; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--charcoal)"; }}
              >
                {loading ? "Saving…" : "Create Account"}
              </button>
            </form>

            <button
              data-testid="button-save-profile-skip"
              onClick={onDone}
              className="font-body"
              style={{
                width: "100%",
                padding: "12px",
                background: "none",
                border: "none",
                fontSize: 12,
                color: "var(--muted)",
                cursor: "pointer",
                marginTop: 8,
                letterSpacing: "0.05em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              Skip for now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
