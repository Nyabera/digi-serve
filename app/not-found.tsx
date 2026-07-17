import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">
          Error 404
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page may have moved, no longer exist, or may not be available from
          your current workspace.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
