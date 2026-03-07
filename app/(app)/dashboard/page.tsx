export default function DashboardPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--warm-white)" }}
    >
      <h1
        className="font-display text-3xl tracking-widest uppercase"
        style={{ color: "var(--charcoal)" }}
        data-testid="text-page-title"
      >
        Dashboard
      </h1>
    </main>
  );
}
