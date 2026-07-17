import Link from "next/link";

interface PermissionDeniedProps {
  title?: string;
  description?: string;
  returnHref?: string;
  returnLabel?: string;
}

export function PermissionDenied({
  title = "Access denied",
  description = "You do not have permission to access this page or perform this action.",
  returnHref = "/",
  returnLabel = "Return to safety",
}: PermissionDeniedProps) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <p className="text-sm font-medium text-destructive">
          Permission required
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        <Link
          href={returnHref}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          {returnLabel}
        </Link>
      </section>
    </main>
  );
}
