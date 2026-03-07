import Link from "next/link";
import type { Look } from "@/lib/types";
import { getGradient } from "@/lib/types";
import { Eye } from "lucide-react";

interface LookCardProps {
  look: Look;
  pieceCount?: number;
  variant?: "default" | "explore";
}

export default function LookCard({ look, pieceCount, variant = "default" }: LookCardProps) {
  const gradient = getGradient(look);

  return (
    <Link
      href={`/looks/${look.slug}`}
      data-testid={`card-look-${look.slug}`}
      className="block no-underline group"
      style={{
        minWidth: variant === "default" ? 220 : undefined,
        width: variant === "default" ? 220 : "100%",
        flexShrink: 0,
      }}
    >
      <div
        className="relative flex flex-col justify-end overflow-hidden transition-transform duration-200"
        style={{
          background: gradient,
          height: variant === "default" ? 280 : 320,
          borderRadius: 6,
          padding: "20px 18px",
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          style={{ background: "rgba(26,26,24,0.2)" }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2 text-[11px] font-medium tracking-[0.1em] uppercase"
            style={{
              background: "rgba(250,247,242,0.92)",
              color: "var(--charcoal)",
              borderRadius: 4,
            }}
          >
            <Eye size={14} />
            View Look
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          <div
            data-testid={`badge-look-category-${look.slug}`}
            className="self-start px-2 py-1 text-[9px] font-medium tracking-[0.14em] uppercase"
            style={{
              background: "rgba(250,247,242,0.18)",
              color: "rgba(250,247,242,0.85)",
              borderRadius: 3,
            }}
          >
            {look.category}
          </div>
          {variant === "explore" && look.vibe && (
            <div
              data-testid={`badge-look-vibe-${look.slug}`}
              className="self-start px-2 py-1 text-[9px] font-medium tracking-[0.14em] uppercase"
              style={{
                background: "rgba(250,247,242,0.12)",
                color: "rgba(250,247,242,0.7)",
                borderRadius: 3,
              }}
            >
              {look.vibe}
            </div>
          )}
          {variant === "explore" && look.occasion && (
            <div
              data-testid={`badge-look-occasion-${look.slug}`}
              className="self-start px-2 py-1 text-[9px] font-medium tracking-[0.14em] uppercase"
              style={{
                background: "rgba(250,247,242,0.12)",
                color: "rgba(250,247,242,0.7)",
                borderRadius: 3,
              }}
            >
              {look.occasion}
            </div>
          )}
        </div>

        <h3
          data-testid={`text-look-name-${look.slug}`}
          className="font-display font-light leading-tight"
          style={{
            color: "rgba(250,247,242,0.95)",
            fontSize: variant === "explore" ? 22 : 18,
          }}
        >
          {look.name}
        </h3>

        {pieceCount !== undefined && (
          <div
            data-testid={`text-look-pieces-${look.slug}`}
            className="mt-1 text-[11px] font-light"
            style={{ color: "rgba(250,247,242,0.55)" }}
          >
            {pieceCount} piece{pieceCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </Link>
  );
}
