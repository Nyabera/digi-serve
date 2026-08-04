import Link from "next/link";
import {
  ArrowLeft,
  FileCheck2,
  FolderLock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { SimulatedDocumentUploader } from "@/components/demo/documents/simulated-document-uploader";
import { DemoPublicShell } from "@/components/demo/shell";
import { getDefaultDemoClient } from "@/config/demo";
import type { DemoServiceConfig } from "@/types/demo/client-config";

type ServiceDocumentsPageProps = {
  readonly service: DemoServiceConfig;
};

export function ServiceDocumentsPage({
  service,
}: ServiceDocumentsPageProps) {
  const client = getDefaultDemoClient();
  const requiredCount = service.requiredDocuments.filter(
    (requirement) => requirement.level === "REQUIRED",
  ).length;

  return (
    <DemoPublicShell>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link
            href={`/demo/apply/${service.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to application form
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Step 3 of 3 · Supporting documents
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Add documents for your{" "}
                {service.name.toLowerCase()}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Select non-sensitive sample files that satisfy the
                configured requirements for {client.organization.name}.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Document summary
              </p>
              <p className="mt-2 text-lg font-bold text-slate-950">
                {service.requiredDocuments.length} configured ·{" "}
                {requiredCount} required
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Metadata only in the current session
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-16">
        <SimulatedDocumentUploader service={service} />

        <aside className="h-fit space-y-5 lg:sticky lg:top-24">
          <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
              Demonstration boundary
            </p>

            <h2 className="mt-3 text-xl font-bold tracking-tight">
              Safe file-selection simulation
            </h2>

            <div className="mt-6 grid gap-5 text-sm">
              <div className="flex items-start gap-3">
                <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-[#d8ff00]" />
                <p className="leading-6 text-white/70">
                  File type and maximum size are validated against the
                  selected service configuration.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-[#7aa2ff]" />
                <p className="leading-6 text-white/70">
                  Replacement is available only where the document
                  requirement permits it.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <FolderLock className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9b67]" />
                <p className="leading-6 text-white/70">
                  No file bytes are uploaded to Supabase Storage or another
                  external service.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              <div>
                <h2 className="font-bold text-slate-950">
                  Use sample files only
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Do not choose real identity, academic, financial or other
                  sensitive records during the internal demonstration.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </DemoPublicShell>
  );
}
