import Link from "next/link";

import { getDefaultDemoClient } from "@/config/demo";

type DemoRoutePlaceholderProps = {
  title: string;
  route: string;
  description: string;
  nextHref?: string;
  nextLabel?: string;
};

export function DemoRoutePlaceholder({
  title,
  route,
  description,
  nextHref,
  nextLabel,
}: DemoRoutePlaceholderProps) {
  const client = getDefaultDemoClient();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-950">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          FAIDIA Demo Engine
        </p>

        <p className="mt-2 text-sm font-medium text-slate-600">
          {client.organization.name}
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {title}
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          {description}
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Route
          </p>
          <code className="mt-2 block break-all text-sm text-slate-800">
            {route}
          </code>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/demo"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Route index
          </Link>

          {nextHref && nextLabel ? (
            <Link
              href={nextHref}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              {nextLabel}
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
