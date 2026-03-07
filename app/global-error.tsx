"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ padding: 40, fontFamily: "sans-serif" }}>
        <h2>Something went wrong</h2>
        <pre style={{ color: "red", whiteSpace: "pre-wrap", marginTop: 16 }}>
          {error.message}
        </pre>
        <button onClick={reset} style={{ marginTop: 16, padding: "8px 16px" }}>
          Try again
        </button>
      </body>
    </html>
  );
}
