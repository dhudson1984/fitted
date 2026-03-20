"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError("Incorrect email or password. Please try again.");
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setError("Sign in failed. Please try again.");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        try {
          if (profile.first_name) localStorage.setItem("userName", profile.first_name);
          if (profile.survey_data) {
            const sd = profile.survey_data as Record<string, unknown>;
            if (sd.survey) localStorage.setItem("fitted_survey", JSON.stringify(sd.survey));
            if (sd.savedLooks) localStorage.setItem("fitted_saved_looks", JSON.stringify(sd.savedLooks));
            if (sd.savedItems) localStorage.setItem("fitted_saved_items", JSON.stringify(sd.savedItems));
            if (sd.builds) localStorage.setItem("fitted_builds", JSON.stringify(sd.builds));
          }
        } catch {}
      } else {
        if (user.email) {
          const name = user.email.split("@")[0];
          localStorage.setItem("userName", name);
        }
      }

      document.cookie = "fitted_survey_completed=true; path=/; max-age=31536000";
      await fetch("/api/survey/complete", { method: "POST" });

      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
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
            fontSize: 28,
            fontWeight: 300,
            color: "var(--charcoal)",
            lineHeight: 1.2,
            marginBottom: 32,
          }}
        >
          Welcome back.
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              data-testid="input-sign-in-email"
              placeholder="you@example.com"
              autoComplete="email"
              className="font-body"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--charcoal)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--sand)")}
            />
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
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              data-testid="input-sign-in-password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="font-body"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--charcoal)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--sand)")}
            />
          </div>

          {error && (
            <p
              data-testid="text-sign-in-error"
              className="font-body"
              style={{ fontSize: 12, color: "var(--muted)", marginTop: -4 }}
            >
              {error}
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
          <a
            href="/onboarding"
            style={{ color: "var(--bark)", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Take the style survey
          </a>
        </p>
      </div>
    </div>
  );
}
