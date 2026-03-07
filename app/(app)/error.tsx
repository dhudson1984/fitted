"use client";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h2>App Error</h2>
      <pre style={{ color: "red", whiteSpace: "pre-wrap", marginTop: 16 }}>
        {error.message}
      </pre>
      <button onClick={reset} style={{ marginTop: 16, padding: "8px 16px" }}>
        Try again
      </button>
    </div>
  );
}
