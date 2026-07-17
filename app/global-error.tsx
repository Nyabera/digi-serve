"use client";

interface GlobalErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  console.error("Unhandled root application error:", error);

  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <section style={{ maxWidth: "480px" }}>
            <p style={{ fontWeight: 600 }}>FAIDIA encountered an error.</p>

            <p style={{ lineHeight: 1.6 }}>
              The application shell could not be loaded.
            </p>

            <button
              type="button"
              onClick={reset}
              style={{
                marginTop: "16px",
                padding: "10px 16px",
                cursor: "pointer",
              }}
            >
              Reload application
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
