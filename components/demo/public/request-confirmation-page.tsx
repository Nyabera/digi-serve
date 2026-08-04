import Link from "next/link";
import {
  ArrowLeft,
  ClipboardCheck,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import { RequestReviewSubmission } from "@/components/demo/requests/request-review-submission";
import { DemoPublicShell } from "@/components/demo/shell";
import { getDefaultDemoClient } from "@/config/demo";
import type { DemoServiceConfig } from "@/types/demo/client-config";

type RequestConfirmationPageProps = {
  readonly requestId: string;
  readonly service: DemoServiceConfig;
};

export function RequestConfirmationPage({
  requestId,
  service,
}: RequestConfirmationPageProps) {
  const client = getDefaultDemoClient();

  return (
    <DemoPublicShell>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link
            href={`/demo/apply/${service.slug}?step=documents`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to supporting documents
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Final step · Review and submit
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Review your {service.name.toLowerCase()}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Check the applicant information, responses and selected
                document metadata before submitting to{" "}
                {client.organization.name}.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Draft reference
              </p>

              <p className="mt-2 font-mono text-xl font-bold text-slate-950">
                {requestId}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Becomes the tracking reference after confirmation
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-16">
        <RequestReviewSubmission
          requestId={requestId}
          service={service}
        />

        <aside className="h-fit space-y-5 lg:sticky lg:top-24">
          <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
              Submission checklist
            </p>

            <h2 className="mt-3 text-xl font-bold tracking-tight">
              Confirm the complete request
            </h2>

            <div className="mt-6 grid gap-5 text-sm">
              <div className="flex items-start gap-3">
                <ClipboardCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#d8ff00]"
                  aria-hidden="true"
                />
                <p className="leading-6 text-white/70">
                  Review all configured form responses.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <FileCheck2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#7aa2ff]"
                  aria-hidden="true"
                />
                <p className="leading-6 text-white/70">
                  Check required-document metadata and filenames.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9b67]"
                  aria-hidden="true"
                />
                <p className="leading-6 text-white/70">
                  Accept the explicit submission declaration.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                aria-hidden="true"
              />

              <div>
                <h2 className="font-bold text-slate-950">
                  Controlled demo submission
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  D19 creates a synthetic submission event and confirmation
                  record only in the Demo Engine browser session.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </DemoPublicShell>
  );
}
