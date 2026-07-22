import Link from "next/link";

import { HomepageReferencePreview } from "@/components/demo/homepages/homepage-reference-preview";
import { DemoClientConfigSummary } from "@/components/demo/shared/demo-client-config-summary";
import { DemoStateSummary } from "@/components/demo/shared/demo-state-summary";
import { DemoPublicShell } from "@/components/demo/shell";
import { getDefaultDemoClient } from "@/config/demo";

const routes = [
  {
    label: "Homepage",
    pattern: "/demo",
    href: "/demo",
  },
  {
    label: "Service information",
    pattern: "/demo/services/[serviceSlug]",
    href: "/demo/services/transcript-request",
  },
  {
    label: "Applicant sign-up",
    pattern: "/demo/sign-up",
    href: "/demo/sign-up",
  },
  {
    label: "Application form",
    pattern: "/demo/apply/[serviceSlug]",
    href: "/demo/apply/transcript-request",
  },
  {
    label: "Submission confirmation",
    pattern: "/demo/requests/[requestId]/confirmation",
    href: "/demo/requests/REQ-DEMO-001/confirmation",
  },
  {
    label: "Applicant tracking",
    pattern: "/demo/track/[requestId]",
    href: "/demo/track/REQ-DEMO-001",
  },
  {
    label: "Officer dashboard",
    pattern: "/demo/officer",
    href: "/demo/officer",
  },
  {
    label: "Officer request review",
    pattern: "/demo/officer/requests/[requestId]",
    href: "/demo/officer/requests/REQ-DEMO-001",
  },
  {
    label: "Receiving department",
    pattern: "/demo/department",
    href: "/demo/department",
  },
  {
    label: "Department handoff",
    pattern: "/demo/department/handoffs/[handoffId]",
    href: "/demo/department/handoffs/HND-DEMO-001",
  },
  {
    label: "Supervisor dashboard",
    pattern: "/demo/supervisor",
    href: "/demo/supervisor",
  },
  {
    label: "Supervisor approval",
    pattern: "/demo/supervisor/approvals/[requestId]",
    href: "/demo/supervisor/approvals/REQ-DEMO-001",
  },
  {
    label: "Controlled outcome",
    pattern: "/demo/outcomes/[requestId]",
    href: "/demo/outcomes/REQ-DEMO-001",
  },
  {
    label: "Reports",
    pattern: "/demo/reports",
    href: "/demo/reports",
  },
] as const;

export default function DemoRouteIndexPage() {
  const client = getDefaultDemoClient();

  return (
    <DemoPublicShell>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            FAIDIA Demo Engine
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            {client.organization.name} service demonstration
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            D9 installs the shared public-facing shell. Homepage
            variants and the final public journey will replace this
            temporary route index during later stages.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/demo/services/transcript-request"
              className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              style={{
                backgroundColor: client.branding.primaryColor,
              }}
            >
              Explore Transcript Request
            </Link>

            <Link
              href="/demo/track/REQ-DEMO-001"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Track sample request
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <HomepageReferencePreview />

        <DemoClientConfigSummary client={client} />

        <DemoStateSummary />

        <div className="mt-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Technical route inventory
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Complete demonstration journey
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Use these route cards to confirm that the public,
              applicant, officer, department, supervisor, outcome and
              reporting areas remain connected.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {routes.map((route) => (
              <Link
                key={route.pattern}
                href={route.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                <span className="block text-base font-bold text-slate-950">
                  {route.label}
                </span>

                <code className="mt-2 block break-all text-sm text-slate-500">
                  {route.pattern}
                </code>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </DemoPublicShell>
  );
}
