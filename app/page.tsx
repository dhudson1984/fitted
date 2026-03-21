import type { Metadata } from "next";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import LandingNav from "@/components/landing/LandingNav";
import HeroSlideshow from "@/components/landing/HeroSlideshow";
import ScrollReveal from "@/components/landing/ScrollReveal";

export const metadata: Metadata = {
  title: "Fitted — Men's Style, Curated",
  description: "AI-matched outfit curation with shoppable pieces. Premium men's fashion styling made simple. Complete a style profile and discover curated looks.",
  openGraph: {
    title: "Fitted — Men's Style, Curated",
    description: "AI-matched outfit curation with shoppable pieces. Premium men's fashion styling made simple.",
    type: "website",
    siteName: "Fitted",
  },
  twitter: {
    card: "summary",
    title: "Fitted — Men's Style, Curated",
    description: "AI-matched outfit curation with shoppable pieces. Premium men's fashion styling made simple.",
  },
};

interface Look {
  id: string;
  slug: string;
  name: string;
  category: string;
  image_url?: string | null;
}

const cardGradients = [
  "linear-gradient(165deg,#8B7355 0%,#5C4A32 30%,#2C2416 100%)",
  "linear-gradient(165deg,#4A5E4A 0%,#2E3D2E 40%,#1A2318 100%)",
  "linear-gradient(165deg,#5C5A6E 0%,#3A3848 40%,#1E1C28 100%)",
  "linear-gradient(165deg,#6E4E3A 0%,#4A3226 40%,#221815 100%)",
];

const steps = [
  {
    number: "01",
    title: "Tell Us Your Style",
    desc: "Answer a short style profile — your lifestyle, preferences, fit, and budget. Takes about three minutes and shapes everything you see on Fitted.",
  },
  {
    number: "02",
    title: "Build Your Look",
    desc: "Upload inspiration from anywhere, or browse curated looks tailored to you. Our AI breaks down every outfit and finds matching pieces across top retailers.",
  },
  {
    number: "03",
    title: "Shop It",
    desc: "See the full outfit laid out, explore each piece in detail, and click through to buy. Save looks for later or mark them as yours once purchased.",
  },
];

const testimonials = [
  {
    quote: "I uploaded a photo from an ad I saw and had the whole outfit identified and shopped in under ten minutes.",
    author: "James R., 34 — San Francisco",
  },
  {
    quote: "Finally something that actually gets my style. I'm not a fashion guy but I want to look good — Fitted figured that out fast.",
    author: "Marcus T., 29 — New York",
  },
  {
    quote: "The flat-lay view is a game changer. Seeing the whole outfit together before I buy anything has saved me so much money.",
    author: "Daniel K., 38 — Los Angeles",
  },
];

export default async function LandingPage() {
  let looks: Look[] = [];
  try {
    const supabase = createServerSupabase();
    const { data } = await supabase
      .from("looks")
      .select("id, slug, name, category, image_url")
      .eq("is_active", true)
      .not("image_url", "is", null)
      .neq("image_url", "")
      .limit(4);
    if (data) looks = data;
  } catch {
    looks = [];
  }

  return (
    <>
      <LandingNav />
      <HeroSlideshow />

      {/* How It Works */}
      <section
        id="how-it-works"
        data-testid="section-how-it-works"
        style={{
          padding: "120px 60px",
          background: "var(--cream)",
        }}
        className="max-md:!px-6 max-md:!py-[72px]"
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--bark)",
            marginBottom: 16,
          }}
        >
          The Process
        </p>
        <h2
          className="font-display max-md:!text-[clamp(28px,7vw,42px)] max-md:!mb-12"
          style={{
            fontSize: "clamp(36px,4vw,52px)",
            fontWeight: 300,
            color: "var(--charcoal)",
            marginBottom: 80,
            maxWidth: 500,
            lineHeight: 1.15,
          }}
        >
          Style made simple, in three steps.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 60,
          }}
          className="max-md:!grid-cols-1 max-md:!gap-9"
        >
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.15}>
              <div
                data-testid={`step-${step.number}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <div
                  className="font-display"
                  style={{ fontSize: 52, fontWeight: 300, color: "var(--stone)", lineHeight: 1 }}
                >
                  {step.number}
                </div>
                <div style={{ width: 32, height: 1, background: "var(--stone)" }} />
                <div
                  className="font-display"
                  style={{ fontSize: 22, fontWeight: 400, color: "var(--charcoal)" }}
                >
                  {step.title}
                </div>
                <p
                  className="font-body"
                  style={{ fontSize: 14, fontWeight: 300, color: "var(--muted)", lineHeight: 1.8 }}
                >
                  {step.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Featured Looks */}
      <section
        id="featured-looks"
        data-testid="section-featured-looks"
        style={{
          padding: "0 60px 120px",
          background: "var(--cream)",
        }}
        className="max-md:!px-6 max-md:!pb-[72px]"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 48,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--bark)",
                marginBottom: 16,
              }}
            >
              Featured Looks
            </p>
            <h2
              className="font-display max-md:!text-[clamp(28px,7vw,42px)]"
              style={{
                fontSize: "clamp(36px,4vw,52px)",
                fontWeight: 300,
                color: "var(--charcoal)",
                marginBottom: 0,
                lineHeight: 1.15,
              }}
            >
              Built for how you actually live.
            </h2>
          </div>
          <Link
            href="/explore"
            data-testid="link-explore-all"
            className="font-body max-md:!hidden"
            style={{
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--bark)",
              textDecoration: "none",
              transition: "color 0.2s",
              flexShrink: 0,
            }}
          >
            Explore All
          </Link>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
          className="max-md:!grid-cols-2 max-md:!gap-3.5"
        >
          {(looks.length > 0 ? looks : fallbackLooks).map((look, i) => (
            <ScrollReveal key={look.id || i} delay={i * 0.1}>
              <Link
                href={`/looks/${look.slug}`}
                data-testid={`card-look-${look.slug}`}
                className="group"
                style={{
                  position: "relative",
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  display: "block",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: cardGradients[i % cardGradients.length],
                  }}
                />
                {look.image_url && look.image_url.length > 0 && (
                  <img
                    src={look.image_url}
                    alt={look.name}
                    data-testid={`img-featured-look-${look.slug}`}
                    className="transition-transform duration-600 group-hover:scale-105"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    loading="lazy"
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top,rgba(26,26,24,0.8) 0%,rgba(26,26,24,0.15) 55%,transparent 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 20,
                    gap: 4,
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--stone)",
                    }}
                  >
                    {look.category}
                  </span>
                  <span
                    className="font-display"
                    style={{ fontSize: 18, fontWeight: 400, color: "var(--cream)" }}
                  >
                    {look.name}
                  </span>
                  <span
                    className="font-body"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--stone)",
                      marginTop: 4,
                    }}
                  >
                    Shop the Look
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        data-testid="section-testimonials"
        style={{
          padding: "120px 60px",
          background: "var(--charcoal)",
        }}
        className="max-md:!px-6 max-md:!py-[72px]"
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--stone)",
            marginBottom: 16,
          }}
        >
          What They&apos;re Saying
        </p>
        <h2
          className="font-display max-md:!text-[clamp(28px,7vw,42px)]"
          style={{
            fontSize: "clamp(36px,4vw,52px)",
            fontWeight: 300,
            color: "var(--cream)",
            marginBottom: 80,
            maxWidth: 500,
            lineHeight: 1.15,
          }}
        >
          Real guys. Real wardrobes.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 48,
          }}
          className="max-md:!grid-cols-1 max-md:!gap-4"
        >
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <div data-testid={`testimonial-${i}`}>
                <div
                  style={{
                    width: 32,
                    height: 1,
                    background: "var(--bark)",
                    marginBottom: 24,
                  }}
                />
                <p
                  className="font-display"
                  style={{
                    fontSize: 20,
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: "var(--cream)",
                    lineHeight: 1.6,
                    marginBottom: 20,
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <span
                  className="font-body"
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--stone)",
                  }}
                >
                  {t.author}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section
        data-testid="section-final-cta"
        style={{
          padding: "160px 60px",
          background: "var(--sand)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
        className="max-md:!px-6 max-md:!py-24"
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--bark)",
          }}
        >
          Ready to Start
        </p>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(42px,5vw,68px)",
            fontWeight: 300,
            color: "var(--charcoal)",
            lineHeight: 1.1,
            maxWidth: 600,
          }}
        >
          Your best-dressed self is three minutes away.
        </h2>
        <p
          className="font-body"
          style={{
            fontSize: 15,
            fontWeight: 300,
            color: "var(--muted)",
            maxWidth: 400,
            lineHeight: 1.7,
          }}
        >
          Take the style profile, build your first look, and see what Fitted finds for you.
        </p>
        <Link
          href="/onboarding"
          data-testid="link-final-cta"
          className="font-body"
          style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--warm-white)",
            background: "var(--charcoal)",
            padding: "18px 48px",
            textDecoration: "none",
            transition: "background 0.25s",
            border: "none",
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          Build Your Look
        </Link>
      </section>

      {/* Footer */}
      <footer
        data-testid="landing-footer"
        style={{
          padding: "40px 60px",
          background: "var(--deep)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
        }}
        className="max-md:!flex-col max-md:!gap-6 max-md:!px-6 max-md:!py-8 max-md:!text-center"
      >
        {/* Wordmark */}
        <span
          className="font-display"
          style={{
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--stone)",
            flexShrink: 0,
          }}
        >
          Fitted
        </span>

        {/* Social icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <a
            href="https://instagram.com/lookfitted"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-instagram"
            aria-label="Fitted on Instagram"
            style={{
              color: "rgba(196,184,154,0.5)",
              display: "flex",
              alignItems: "center",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--stone)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(196,184,154,0.5)")}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://tiktok.com/@lookfitted"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-tiktok"
            aria-label="Fitted on TikTok"
            style={{
              color: "rgba(196,184,154,0.5)",
              display: "flex",
              alignItems: "center",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--stone)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(196,184,154,0.5)")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.81a8.16 8.16 0 0 0 4.77 1.52V6.88a4.84 4.84 0 0 1-1-.19z" />
            </svg>
          </a>
        </div>

        {/* Nav + email */}
        <ul
          style={{
            display: "flex",
            gap: 28,
            listStyle: "none",
            alignItems: "center",
            flexWrap: "wrap",
          }}
          className="max-md:!justify-center"
        >
          <li>
            <a
              href="mailto:hello@shopfitted.co"
              data-testid="link-contact-email"
              className="font-body"
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "rgba(196,184,154,0.5)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--stone)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(196,184,154,0.5)")}
            >
              hello@shopfitted.co
            </a>
          </li>
          <li>
            <a
              href="#"
              className="font-body"
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(196,184,154,0.5)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--stone)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(196,184,154,0.5)")}
            >
              Privacy
            </a>
          </li>
          <li>
            <a
              href="#"
              className="font-body"
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(196,184,154,0.5)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--stone)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(196,184,154,0.5)")}
            >
              Terms
            </a>
          </li>
        </ul>
      </footer>
    </>
  );
}

const fallbackLooks: Look[] = [
  { id: "1", slug: "weekend-edit", name: "The Weekend Edit", category: "Smart Casual" },
  { id: "2", slug: "trail-ready-set", name: "The Trail-Ready Set", category: "Athletic & Outdoors" },
  { id: "3", slug: "sharp-without-trying", name: "Sharp Without Trying", category: "Work" },
  { id: "4", slug: "after-hours-look", name: "The After-Hours Look", category: "Night Out" },
];
