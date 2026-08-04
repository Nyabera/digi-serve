import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  FileCheck2,
  FileText,
  ShieldCheck,
} from "lucide-react";

import { ConfiguredServiceForm } from "@/components/demo/forms/configured-service-form";
import { DemoPublicShell } from "@/components/demo/shell";
import { getDefaultDemoClient } from "@/config/demo";
import type { DemoServiceConfig } from "@/types/demo/client-config";

type ServiceApplicationPageProps = {
  readonly service: DemoServiceConfig;
};

function formatFee(service: DemoServiceConfig): string {
  if (service.fee.type === "FREE") {
    return "No service fee";
  }

  if (service.fee.amount && service.fee.currency) {
    return `${service.fee.currency} ${service.fee.amount.toLocaleString()}`;
  }

  return service.fee.label;
}

export function ServiceApplicationPage({
  service,
}: ServiceApplicationPageProps) {
  const client = getDefaultDemoClient();
  const totalFields = service.form.sections.reduce(
    (count, section) => count + section.fields.length,
    0,
  );

  return (
    <DemoPublicShell>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link
            href={`/demo/services/${service.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to service information
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Step 2 of 3 · Application form
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Complete your {service.name.toLowerCase()}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                The form below is rendered directly from the configured
                service schema for {client.organization.name}.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Form summary
              </p>
              <p className="mt-2 text-lg font-bold text-slate-950">
                {service.form.sections.length} section
                {service.form.sections.length === 1 ? "" : "s"} · {totalFields} fields
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Saved in browser session state
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-16">
        <ConfiguredServiceForm service={service} />

        <aside className="h-fit space-y-5 lg:sticky lg:top-24">
          <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
              Request summary
            </p>

            <h2 className="mt-3 text-xl font-bold tracking-tight">
              {service.name}
            </h2>

            <dl className="mt-6 grid gap-5 text-sm">
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
                <div>
                  <dt className="font-bold">Processing target</dt>
                  <dd className="mt-1 text-white/65">
                    {service.expectedProcessingTime}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
                <div>
                  <dt className="font-bold">Supporting documents</dt>
                  <dd className="mt-1 text-white/65">
                    {service.requiredDocuments.length} configured
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
                <div>
                  <dt className="font-bold">Fee status</dt>
                  <dd className="mt-1 text-white/65">{formatFee(service)}</dd>
                </div>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              <div>
                <h2 className="font-bold text-slate-950">
                  Synthetic draft only
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  D17 stores responses in the shared Demo Engine session.
                  It does not submit production records or upload files.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </DemoPublicShell>
  );
}
