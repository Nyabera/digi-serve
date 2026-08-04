"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import { useDemoState } from "@/features/demo/state";
import type { DemoServiceConfig } from "@/types/demo/client-config";

type ApplicantSignUpFormProps = {
  readonly service: DemoServiceConfig;
};

export function ApplicantSignUpForm({
  service,
}: ApplicantSignUpFormProps) {
  const router = useRouter();
  const { state, dispatch, isHydrated } = useDemoState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const accepted = formData.get("accuracyDeclaration") === "on";

    if (!fullName || !email || !phone || !accepted) {
      setErrorMessage(
        "Complete all required fields and accept the declaration.",
      );
      return;
    }

    const at = new Date().toISOString();

    dispatch({
      type: "UPDATE_APPLICANT",
      applicant: {
        fullName,
        email,
        phone,
        registered: true,
      },
      at,
    });

    dispatch({
      type: "SET_ACTIVE_ROLE",
      role: "APPLICANT",
      at,
    });

    setErrorMessage(null);
    router.push(`/demo/apply/${service.slug}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex items-start gap-4 border-b border-slate-200 pb-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <UserRound className="h-5 w-5" aria-hidden="true" />
        </span>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Simulated applicant access
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Your applicant details
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            These details are saved only in the browser-based demo state.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-6">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-950">
            Full legal name
          </span>
          <input
            name="fullName"
            type="text"
            required
            autoComplete="name"
            defaultValue={state.applicant.fullName}
            placeholder="Enter your full legal name"
            className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-950">
              Email address
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={state.applicant.email}
              placeholder="name@example.com"
              className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-950">
              Phone number
            </span>
            <input
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              defaultValue={state.applicant.phone}
              placeholder="+254 7XX XXX XXX"
              className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <input
            name="accuracyDeclaration"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-slate-300"
          />
          <span className="text-sm leading-6 text-slate-700">
            I confirm that these demonstration details are accurate and may
            be used to continue the simulated request journey.
          </span>
        </label>
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 text-sm leading-6 text-slate-600">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>No real authentication account is created.</span>
        </div>

        <button
          type="submit"
          disabled={!isHydrated}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue to application
          <ArrowRight className="ml-3 h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          Selected service: <strong>{service.name}</strong>
        </span>
      </div>
    </form>
  );
}
