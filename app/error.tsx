"use client";

import { useEffect } from "react";

interface ApplicationErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ApplicationError({
  error,
  reset,
}: ApplicationErrorProps) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <p className="text-sm font-medium text-destructive">
          Something went wrong
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          The page could not be loaded
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The error has been contained. Try loading this section again.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
