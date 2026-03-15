"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LookBackNav() {
  const backHref = "/";
  const backLabel = "Back to Home";

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
