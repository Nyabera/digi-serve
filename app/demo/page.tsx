import Link from "next/link";

import { DemoClientConfigSummary } from "@/components/demo/shared/demo-client-config-summary";
import { DemoStateSummary } from "@/components/demo/shared/demo-state-summary";
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
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          FAIDIA Demo Engine
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          D6 client configuration
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          The route tree now reads institution, service, department, workflow
          and presentation information from one typed configuration object.
        </p>

        <DemoClientConfigSummary client={client} />

        <DemoStateSummary />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {routes.map((route) => (
            <Link
              key={route.pattern}
              href={route.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              <span className="block text-base font-semibold">
                {route.label}
              </span>

              <code className="mt-2 block break-all text-sm text-slate-500">
                {route.pattern}
              </code>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
