import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
} from "lucide-react";

import { ApplicantSignUpForm } from "@/components/demo/forms/applicant-sign-up-form";
import { DemoPublicShell } from "@/components/demo/shell";
import { getDefaultDemoClient } from "@/config/demo";
import type { DemoServiceConfig } from "@/types/demo/client-config";

type ApplicantSignUpPageProps = {
  readonly service: DemoServiceConfig;
};

export function ApplicantSignUpPage({
  service,
}: ApplicantSignUpPageProps) {
  const client = getDefaultDemoClient();

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
                Step 1 of 3 · Applicant access
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Start your {service.name.toLowerCase()}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Confirm your basic applicant details before continuing to
                the configured service form.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Institution
              </p>
              <p className="mt-2 text-lg font-bold text-slate-950">
                {client.organization.name}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {service.expectedProcessingTime}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-16">
        <ApplicantSignUpForm service={service} />

        <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
            What happens next
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">
            One continuous request journey
          </h2>

          <ol className="mt-7 grid gap-5">
            <li className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <FileText className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold">Complete the form</p>
                <p className="mt-1 text-sm leading-6 text-white/65">
                  Provide the details configured for this service.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold">Review before submission</p>
                <p className="mt-1 text-sm leading-6 text-white/65">
                  Confirm the information and simulated documents.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Clock3 className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold">Track progress</p>
                <p className="mt-1 text-sm leading-6 text-white/65">
                  Follow applicant-safe updates after submission.
                </p>
              </div>
            </li>
          </ol>

          <div className="mt-7 border-t border-white/10 pt-6">
            <div className="flex items-start gap-3 text-sm leading-6 text-white/70">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#d8ff00]" aria-hidden="true" />
              <p>
                This is a controlled demonstration. It uses synthetic
                browser state and does not create a production account.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </DemoPublicShell>
  );
}
