import Link from "next/link";

import { DemoPublicShell } from "@/components/demo/shell/demo-public-shell";
import { getDefaultDemoClient } from "@/config/demo";

type DemoPublicRoutePlaceholderProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly route: string;
  readonly description: string;
  readonly nextHref: string;
  readonly nextLabel: string;
};

export function DemoPublicRoutePlaceholder({
  eyebrow,
  title,
  route,
  description,
  nextHref,
  nextLabel,
}: DemoPublicRoutePlaceholderProps) {
  const client = getDefaultDemoClient();

  return (
    <DemoPublicShell>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: client.branding.accentColor,
                }}
              />

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                {eyebrow}
              </p>
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              {title}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-16">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            D9 shell verification
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            Public route frame is active
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            This route now uses the shared institutional header,
            responsive public navigation, content frame and footer.
            The final page interface will replace this temporary
            content during its assigned build stage.
          </p>

          <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Route pattern
            </p>

            <code className="mt-2 block break-all text-sm text-slate-800">
              {route}
            </code>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/demo"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Return home
            </Link>

            <Link
              href={nextHref}
              className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              style={{
                backgroundColor: client.branding.primaryColor,
              }}
            >
              {nextLabel}
            </Link>
          </div>
        </article>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Service portal
          </p>

          <h2 className="mt-3 text-lg font-bold text-slate-950">
            {client.organization.shortName}
          </h2>

          <dl className="mt-5 grid gap-4 text-sm">
            <div>
              <dt className="font-semibold text-slate-950">
                Services
              </dt>
              <dd className="mt-1 text-slate-600">
                {client.services.length} configured
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-950">
                Departments
              </dt>
              <dd className="mt-1 text-slate-600">
                {client.departments.length} participating
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-950">
                Environment
              </dt>
              <dd className="mt-1 text-slate-600">
                Synthetic demonstration
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </DemoPublicShell>
  );
}
