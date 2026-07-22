"use client";

import {
  selectDemoStateSummary,
  useDemoState,
} from "@/features/demo/state";

export function DemoStateSummary() {
  const { state, isHydrated } = useDemoState();
  const summary = selectDemoStateSummary(state);

  const metrics = [
    {
      label: "Open requests",
      value: summary.openRequests,
    },
    {
      label: "Completed requests",
      value: summary.completedRequests,
    },
    {
      label: "Pending handoffs",
      value: summary.pendingHandoffs,
    },
    {
      label: "Unread notifications",
      value: summary.unreadNotifications,
    },
  ];

  return (
    <section
      aria-labelledby="demo-state-summary-title"
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      data-demo-state-ready={isHydrated ? "true" : "false"}
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Shared Demo Engine state
        </p>

        <h2
          id="demo-state-summary-title"
          className="text-2xl font-semibold tracking-tight text-slate-950"
        >
          {isHydrated
            ? "Session state ready"
            : "Restoring session state"}
        </h2>

        <p className="text-sm leading-6 text-slate-600">
          Active role: {state.activeRole} · Homepage: Primary · State revision:{" "}
          {summary.revision}
        </p>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
          key={metric.label}
            className="rounded-xl bg-slate-50 p-4"
          >
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {metric.label}
            </dt>
            <dd className="mt-2 text-2xl font-semibold text-slate-950">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 text-xs leading-5 text-slate-500">
        Synthetic browser state only. No production Supabase
        records are read or written.
      </p>
    </section>
  );
}
