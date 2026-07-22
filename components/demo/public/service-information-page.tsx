import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  FolderCheck,
  Info,
} from "lucide-react";

import { DemoPublicShell } from "@/components/demo/shell";
import { ServiceStartPanel } from "@/components/demo/public/service-start-panel";
import type {
  DemoClientConfig,
  DemoDocumentRequirementConfig,
  DemoServiceConfig,
} from "@/types/demo/client-config";

interface ServiceInformationPageProps {
  readonly client: DemoClientConfig;
  readonly service: DemoServiceConfig;
  readonly workflowVersion: number;
  readonly relatedServices: readonly DemoServiceConfig[];
}

const fileTypeLabels: Readonly<Record<string, string>> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
};

function getDocumentLevelLabel(
  level: DemoDocumentRequirementConfig["level"],
): string {
  switch (level) {
    case "REQUIRED":
      return "Required";
    case "CONDITIONAL":
      return "Conditional";
    case "OPTIONAL":
      return "Optional";
  }
}

function formatAcceptedTypes(
  acceptedTypes: readonly string[],
): string {
  return acceptedTypes
    .map((type) => fileTypeLabels[type] ?? type)
    .join(", ");
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

export function ServiceInformationPage({
  client,
  service,
  workflowVersion,
  relatedServices,
}: ServiceInformationPageProps) {
  const requiredCount = service.requiredDocuments.filter(
    (document) => document.level === "REQUIRED",
  ).length;

  return (
    <DemoPublicShell>
      <section className="bg-[#05060c] text-white">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/65 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to services
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                  {service.category}
                </span>
                <span className="text-xs text-white/45">
                  Service configuration v{workflowVersion}
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                {service.name}
              </h1>

              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/70">
                {service.description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <Clock3 className="h-5 w-5 text-[#d8ff00]" />
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/45">
                  Processing time
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {service.expectedProcessingTime}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <CreditCard className="h-5 w-5 text-[#ff7b39]" />
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/45">
                  Fee
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {formatFee(service)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <FolderCheck className="h-5 w-5 text-[#7aa2ff]" />
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/45">
                  Documents
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {requiredCount} required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f4f1]">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-16">
          <div className="space-y-8">
            <section className="rounded-[22px] border border-slate-200 bg-white p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                About this service
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-slate-950">
                What this request provides
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                {service.shortDescription}
              </p>

              <div className="mt-7 rounded-2xl border border-[#d8e0ff] bg-[#eef2ff] p-5">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#2557ff]" />
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Expected outcome
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {service.outcomeLabel}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[22px] border border-slate-200 bg-white p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Eligibility
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-slate-950">
                Who can apply
              </h2>

              <ul className="mt-7 grid gap-4">
                {service.eligibility.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-[#fafaf8] p-4"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8f5bf] text-[#5c7a00]">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-sm leading-6 text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[22px] border border-slate-200 bg-white p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Requirements
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-slate-950">
                What you need before starting
              </h2>

              <ol className="mt-7 space-y-4">
                {service.requirements.map((item, index) => (
                  <li
                    key={item}
                    className="grid grid-cols-[44px_minmax(0,1fr)] items-start gap-4 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    <span className="text-2xl font-light text-[#2557ff]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-1 text-sm leading-6 text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-[22px] border border-slate-200 bg-white p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Supporting documents
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-slate-950">
                Documents to prepare
              </h2>

              {service.requiredDocuments.length > 0 ? (
                <div className="mt-7 space-y-4">
                  {service.requiredDocuments.map((document) => (
                    <article
                      key={document.id}
                      className="rounded-2xl border border-slate-200 bg-[#fafaf8] p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf2ff] text-[#2557ff]">
                            <FileText className="h-5 w-5" />
                          </span>
                          <div>
                            <h3 className="text-base font-semibold text-slate-950">
                              {document.name}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {document.description}
                            </p>
                          </div>
                        </div>

                        <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                          {getDocumentLevelLabel(document.level)}
                        </span>
                      </div>

                      <dl className="mt-5 grid gap-3 border-t border-slate-200 pt-4 text-xs sm:grid-cols-3">
                        <div>
                          <dt className="uppercase tracking-wide text-slate-500">
                            Formats
                          </dt>
                          <dd className="mt-1 font-semibold text-slate-800">
                            {formatAcceptedTypes(document.acceptedFileTypes)}
                          </dd>
                        </div>
                        <div>
                          <dt className="uppercase tracking-wide text-slate-500">
                            Maximum size
                          </dt>
                          <dd className="mt-1 font-semibold text-slate-800">
                            {document.maximumSizeMb} MB
                          </dd>
                        </div>
                        <div>
                          <dt className="uppercase tracking-wide text-slate-500">
                            Replacement
                          </dt>
                          <dd className="mt-1 font-semibold text-slate-800">
                            {document.replacementAllowed ? "Allowed" : "Not allowed"}
                          </dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-7 rounded-2xl border border-slate-200 bg-[#fafaf8] p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#6f9100]" />
                    <p className="text-sm leading-6 text-slate-600">
                      This service does not require document uploads before submission.
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-[22px] border border-slate-200 bg-white p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Process
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-slate-950">
                What happens after you start
              </h2>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {[
                  ["01", "Create your profile", "Provide the minimum applicant details needed to continue."],
                  ["02", "Complete the request", "Fill in the configured form and review the service requirements."],
                  ["03", "Submit for review", "The responsible department receives and reviews your request."],
                  ["04", "Track the outcome", "Follow applicant-safe updates until the controlled outcome is ready."],
                ].map(([number, title, description]) => (
                  <article
                    key={number}
                    className="border-t border-slate-200 pt-5"
                  >
                    <p className="text-sm font-semibold text-[#2557ff]">
                      {number}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-slate-950">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <ServiceStartPanel service={service} />
        </div>
      </section>

      {relatedServices.length > 0 ? (
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Other services
            </p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="max-w-2xl font-serif text-4xl leading-tight tracking-tight text-slate-950">
                Continue exploring {client.organization.shortName}
              </h2>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2557ff]"
              >
                Return to portal home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {relatedServices.map((relatedService) => (
                <Link
                  key={relatedService.id}
                  href={`/demo/services/${relatedService.slug}`}
                  className="group rounded-[20px] border border-slate-200 bg-[#fafaf8] p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {relatedService.category}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold text-slate-950">
                        {relatedService.name}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {relatedService.shortDescription}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:text-[#2557ff]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </DemoPublicShell>
  );
}
