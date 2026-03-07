export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--warm-white)" }}
    >
      <div className="text-center">
        <h1
          className="font-display text-5xl tracking-widest uppercase"
          style={{ color: "var(--charcoal)" }}
          data-testid="text-logo"
        >
          Fitted
        </h1>
        <p
          className="font-body text-sm tracking-wide mt-4"
          style={{ color: "var(--muted)" }}
          data-testid="text-tagline"
        >
          Men&apos;s Style, Curated
        </p>
      </div>
    </main>
  );
}
