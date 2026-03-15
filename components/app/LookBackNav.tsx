"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LookBackNav() {
  const [backHref, setBackHref] = useState("/explore");
  const [backLabel, setBackLabel] = useState("Back to Explore");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        try {
          const survey = localStorage.getItem("fitted_survey");
          if (!survey) {
            setBackHref("/");
            setBackLabel("Back to Home");
          }
        } catch {
          setBackHref("/");
          setBackLabel("Back to Home");
        }
      }
    });
  }, []);

  return (
    <div
      style={{
        borderBottom: "1px solid var(--sand)",
        background: "var(--warm-white)",
        position: "sticky",
        top: "var(--nav-h)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Link
          href={backHref}
          data-testid="link-back-to-explore"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "var(--muted)",
            textDecoration: "none",
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}
        >
          <ArrowLeft size={16} />
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
