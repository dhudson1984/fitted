import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLookBySlug, getRelatedLooks, getGradient } from "@/lib/data";
import PieceCard from "@/components/app/PieceCard";
import LookCard from "@/components/app/LookCard";

function generateStylingNotes(look: { name: string; category: string; vibe: string; occasion: string; season: string; pieces: { name: string; slot_type: string; brand: string; color: string; material: string }[] }): string {
  const pieceNames = look.pieces.map((p) => p.name).slice(0, 3);
  const materials = [...new Set(look.pieces.map((p) => p.material).filter(Boolean))];
  const colors = [...new Set(look.pieces.map((p) => p.color).filter(Boolean))];

  let note = `This ${look.vibe.toLowerCase()} look is curated for ${look.occasion.toLowerCase()} occasions`;
  if (look.season !== "Year-Round") {
    note += ` during ${look.season.toLowerCase()}`;
  }
  note += ". ";

  if (pieceNames.length > 1) {
    note += `The pairing of ${pieceNames.slice(0, -1).join(", ")} and ${pieceNames[pieceNames.length - 1]} creates a cohesive ${look.category.toLowerCase()} aesthetic. `;
  }

  if (colors.length > 1) {
    note += `The ${colors.slice(0, 3).join(" and ").toLowerCase()} palette keeps things grounded and versatile. `;
  }

  if (materials.length > 0) {
    note += `Quality materials like ${materials.slice(0, 3).join(", ").toLowerCase()} ensure comfort and durability.`;
  }

  return note;
}

export default async function LookDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const look = await getLookBySlug(params.slug);

  if (!look) {
    notFound();
  }

  const relatedLooks = await getRelatedLooks(look.category, look.slug, 4);
  const stylingNotes = generateStylingNotes(look);
  const gradient = getGradient(look);

  const tags = [
    { label: look.category, type: "category" },
    { label: look.vibe, type: "vibe" },
    { label: look.occasion, type: "occasion" },
    { label: look.season, type: "season" },
  ];

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--warm-white)" }}
      data-testid="look-detail-page"
    >
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
            href="/explore"
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
            Back to Explore
          </Link>
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          background: gradient,
          padding: "48px 24px 56px",
        }}
      >
        {look.image_url && look.image_url.length > 0 && (
          <img
            src={look.image_url}
            alt={look.name}
            data-testid="img-look-hero"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.35,
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(26,26,24,0.7) 0%, rgba(26,26,24,0.3) 60%, transparent 100%)",
          }}
        />
        <div
          className="relative"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            zIndex: 1,
          }}
        >
          <h1
            data-testid="text-look-name"
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 300,
              color: "rgba(250,247,242,0.95)",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            {look.name}
          </h1>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {tags.map((tag) => (
              <span
                key={tag.type}
                data-testid={`badge-${tag.type}`}
                style={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: tag.type === "category" ? "rgba(250,247,242,0.9)" : "rgba(250,247,242,0.6)",
                  background: tag.type === "category" ? "rgba(250,247,242,0.18)" : "rgba(250,247,242,0.08)",
                  padding: "5px 12px",
                  borderRadius: 3,
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <h2
            data-testid="text-pieces-heading"
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 24,
              fontWeight: 300,
              color: "var(--charcoal)",
              marginBottom: 4,
            }}
          >
            The Pieces
          </h2>
          <p
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: "var(--muted)",
              marginBottom: 24,
            }}
          >
            {look.pieces.length} item{look.pieces.length !== 1 ? "s" : ""} in this look
          </p>
        </div>

        <div
          data-testid="pieces-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {look.pieces.map((piece) => (
            <PieceCard key={piece.id} piece={piece} lookName={look.name} />
          ))}
        </div>
      </div>

      <div
        style={{
          background: "var(--cream)",
          padding: "48px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          <h2
            data-testid="text-styling-heading"
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 24,
              fontWeight: 300,
              color: "var(--charcoal)",
              marginBottom: 16,
            }}
          >
            Why We Styled This
          </h2>
          <p
            data-testid="text-styling-notes"
            style={{
              fontSize: 14,
              fontWeight: 300,
              color: "var(--charcoal)",
              lineHeight: 1.8,
            }}
          >
            {stylingNotes}
          </p>
        </div>
      </div>

      {relatedLooks.length > 0 && (
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "48px 24px 64px",
          }}
        >
          <h2
            data-testid="text-related-heading"
            style={{
              fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif",
              fontSize: 24,
              fontWeight: 300,
              color: "var(--charcoal)",
              marginBottom: 24,
            }}
          >
            More Like This
          </h2>

          <div
            data-testid="related-looks-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {relatedLooks.map((related) => (
              <LookCard key={related.slug} look={related} variant="explore" />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
