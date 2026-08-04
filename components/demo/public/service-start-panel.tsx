import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  CreditCard,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import type { DemoServiceConfig } from "@/types/demo/client-config";

interface ServiceStartPanelProps {
  readonly service: DemoServiceConfig;
}

function formatFee(service: DemoServiceConfig): string {
  if (service.fee.type === "FREE") {
    return "No service fee";
  }

  if (service.fee.amount && service.fee.currency) {
    return `${service.fee.currency} ${service.fee.amount.toLocaleString()}`;
  }

  return service.fee.label;
}

export function ServiceStartPanel({
  service,
}: ServiceStartPanelProps) {
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className="border-b border-slate-200 bg-[#f7f7f5] px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Start this service
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Ready to apply?
          </h2>
        </div>

        <div className="space-y-5 p-6">
          <dl className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#2557ff]" />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Processing target
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-950">
                  {service.expectedProcessingTime}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-[#ff7b39]" />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Fee
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-950">
                  {formatFee(service)}
                </dd>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {service.fee.label}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-[#86aa00]" />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Required documents
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-950">
                  {service.requiredDocuments.length === 0
                    ? "No uploads required"
                    : `${service.requiredDocuments.length} configured`}
                </dd>
              </div>
            </div>
          </dl>

          <div className="rounded-2xl border border-[#cbd7ff] bg-[#eef2ff] p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#2557ff]" />
              <p className="text-sm leading-6 text-slate-700">
                Review the eligibility, requirements and documents before
                starting. Your draft will use the selected service configuration.
              </p>
            </div>
          </div>

          <Link
            href={`/demo/sign-up?service=${service.slug}`}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#2557ff] px-5 text-sm font-semibold text-white transition hover:bg-[#1945de] focus:outline-none focus:ring-2 focus:ring-[#2557ff] focus:ring-offset-2"
          >
            Start request
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <Link
            href="/demo/track/REQ-DEMO-001"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Track an existing request
          </Link>
        </div>
      </div>

      <div className="mt-5 rounded-[20px] border border-slate-200 bg-[#f7f7f5] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Need help?
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Contact the institution before submitting when your academic record,
          identity information or delivery instructions are unclear.
        </p>
      </div>
    </aside>
  );
}
