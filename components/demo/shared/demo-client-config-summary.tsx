import type { DemoClientConfig } from "@/types/demo/client-config";

type DemoClientConfigSummaryProps = {
  client: DemoClientConfig;
};

export function DemoClientConfigSummary({
  client,
}: DemoClientConfigSummaryProps) {
  const transcriptService = client.services.find(
    (service) => service.slug === "transcript-request",
  );

  return (
    <section
      aria-labelledby="demo-client-summary-title"
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Active client configuration
        </p>

        <h2
          id="demo-client-summary-title"
          className="text-2xl font-semibold tracking-tight text-slate-950"
        >
          {client.organization.name}
        </h2>

        <p className="max-w-3xl text-sm leading-6 text-slate-600">
          {client.organization.description}
        </p>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Services
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-slate-950">
            {client.services.length}
          </dd>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Departments
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-slate-950">
            {client.departments.length}
          </dd>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Homepage variants
          </dt>
          <dd className="mt-2 text-base font-semibold text-slate-950">
            {client.homepage.availableVariants.join(" / ")}
          </dd>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Primary service
          </dt>
          <dd className="mt-2 text-base font-semibold text-slate-950">
            {transcriptService?.name ?? "Not configured"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
