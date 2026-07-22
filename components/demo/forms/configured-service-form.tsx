"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Save,
  TriangleAlert,
} from "lucide-react";

import { ConfiguredFormField } from "@/components/demo/forms/configured-form-field";
import { useDemoState } from "@/features/demo/state";
import type {
  DemoFormFieldConfig,
  DemoServiceConfig,
} from "@/types/demo/client-config";
import type { DemoFormValue } from "@/types/demo/demo-state";

type ConfiguredServiceFormProps = {
  readonly service: DemoServiceConfig;
};

function isComplete(
  field: DemoFormFieldConfig,
  value: DemoFormValue | undefined,
): boolean {
  if (!field.required) {
    return true;
  }

  if (field.type === "CHECKBOX" || field.type === "DECLARATION") {
    return value === true;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return false;
}

export function ConfiguredServiceForm({
  service,
}: ConfiguredServiceFormProps) {
  const router = useRouter();
  const { state, dispatch, isHydrated } = useDemoState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const draft = state.formDrafts[service.slug] ?? {};

  const fields = useMemo(
    () => service.form.sections.flatMap((section) => section.fields),
    [service.form.sections],
  );

  const requiredFields = fields.filter((field) => field.required);
  const completedRequiredFields = requiredFields.filter((field) =>
    isComplete(field, draft[field.key]),
  );

  const completionPercentage = requiredFields.length
    ? Math.round(
        (completedRequiredFields.length / requiredFields.length) * 100,
      )
    : 100;

  function setFieldValue(fieldKey: string, value: DemoFormValue) {
    const at = new Date().toISOString();

    dispatch({
      type: "SET_FORM_VALUE",
      serviceSlug: service.slug,
      fieldKey,
      value,
      at,
    });

    setLastSavedAt(at);
    setErrorMessage(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const missingFields = requiredFields.filter(
      (field) => !isComplete(field, draft[field.key]),
    );

    if (missingFields.length > 0) {
      setErrorMessage(
        `Complete ${missingFields.length} required field${
          missingFields.length === 1 ? "" : "s"
        } before continuing.`,
      );
      return;
    }

    const at = new Date().toISOString();

    dispatch({
      type: "ADD_ACTIVITY_EVENT",
      event: {
        id: `ACT-FORM-${Date.now()}`,
        name: "request_started",
        requestId: state.activeRequestId,
        occurredAt: at,
      },
      at,
    });

    router.push(
      `/demo/requests/${state.activeRequestId}/confirmation?service=${service.slug}`,
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Configured service form
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Application information
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Required fields are marked with an asterisk. Draft values are
              preserved in the current browser session.
            </p>
          </div>

          <div className="min-w-48 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-bold text-slate-700">Required fields</span>
              <span className="font-bold text-slate-950">
                {completedRequiredFields.length}/{requiredFields.length}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-slate-950 transition-[width]"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-10">
          {service.form.sections.map((section, sectionIndex) => (
            <fieldset key={section.id} className="grid gap-6">
              <legend className="w-full">
                <span className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                    {sectionIndex + 1}
                  </span>

                  <span>
                    <span className="block text-xl font-bold tracking-tight text-slate-950">
                      {section.title}
                    </span>

                    {section.description ? (
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        {section.description}
                      </span>
                    ) : null}
                  </span>
                </span>
              </legend>

              <div className="grid gap-6 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <ConfiguredFormField
                    key={field.key}
                    field={field}
                    value={draft[field.key] ?? field.defaultValue}
                    onChange={(value) => setFieldValue(field.key, value)}
                  />
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3 text-sm leading-6 text-slate-600">
          {lastSavedAt ? (
            <CheckCircle2
              className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
              aria-hidden="true"
            />
          ) : (
            <Save
              className="mt-1 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
          )}

          <span>
            {lastSavedAt
              ? `Draft saved at ${new Date(lastSavedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Changes save automatically in this demo session."}
          </span>
        </div>

        <button
          type="submit"
          disabled={!isHydrated}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue to review
          <ArrowRight className="ml-3 h-4 w-4" aria-hidden="true" />
        </button>
      </section>
    </form>
  );
}
