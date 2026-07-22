"use client";

import type { DemoFormFieldConfig } from "@/types/demo/client-config";
import type { DemoFormValue } from "@/types/demo/demo-state";

type ConfiguredFormFieldProps = {
  readonly field: DemoFormFieldConfig;
  readonly value: DemoFormValue | undefined;
  readonly onChange: (value: DemoFormValue) => void;
};

function stringValue(value: DemoFormValue | undefined): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return "";
}

export function ConfiguredFormField({
  field,
  value,
  onChange,
}: ConfiguredFormFieldProps) {
  const helpId = field.helpText ? `${field.key}-help` : undefined;

  if (field.type === "CHECKBOX" || field.type === "DECLARATION") {
    return (
      <label
        htmlFor={field.key}
        className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
      >
        <input
          id={field.key}
          name={field.key}
          type="checkbox"
          required={field.required}
          checked={value === true}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300"
        />

        <span>
          <span className="block text-sm font-bold leading-6 text-slate-950">
            {field.label}
            {field.required ? (
              <span className="ml-1 text-red-600" aria-hidden="true">
                *
              </span>
            ) : null}
          </span>

          {field.helpText ? (
            <span
              id={helpId}
              className="mt-1 block text-sm leading-6 text-slate-600"
            >
              {field.helpText}
            </span>
          ) : null}
        </span>
      </label>
    );
  }

  const label = (
    <span className="text-sm font-bold text-slate-950">
      {field.label}
      {field.required ? (
        <span className="ml-1 text-red-600" aria-hidden="true">
          *
        </span>
      ) : null}
    </span>
  );

  if (field.type === "SELECT") {
    return (
      <label htmlFor={field.key} className="grid gap-2">
        {label}

        <select
          id={field.key}
          name={field.key}
          required={field.required}
          value={stringValue(value)}
          aria-describedby={helpId}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">Select an option</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {field.helpText ? (
          <span id={helpId} className="text-sm leading-6 text-slate-500">
            {field.helpText}
          </span>
        ) : null}
      </label>
    );
  }

  if (field.type === "TEXTAREA") {
    return (
      <label htmlFor={field.key} className="grid gap-2 sm:col-span-2">
        {label}

        <textarea
          id={field.key}
          name={field.key}
          required={field.required}
          value={stringValue(value)}
          placeholder={field.placeholder}
          aria-describedby={helpId}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />

        {field.helpText ? (
          <span id={helpId} className="text-sm leading-6 text-slate-500">
            {field.helpText}
          </span>
        ) : null}
      </label>
    );
  }

  const inputType =
    field.type === "EMAIL"
      ? "email"
      : field.type === "PHONE"
        ? "tel"
        : field.type === "YEAR"
          ? "number"
          : "text";

  return (
    <label htmlFor={field.key} className="grid gap-2">
      {label}

      <input
        id={field.key}
        name={field.key}
        type={inputType}
        required={field.required}
        value={stringValue(value)}
        placeholder={field.placeholder}
        aria-describedby={helpId}
        min={field.type === "YEAR" ? 1900 : undefined}
        max={field.type === "YEAR" ? 2100 : undefined}
        onChange={(event) => {
          if (field.type === "YEAR") {
            onChange(event.target.value ? Number(event.target.value) : "");
            return;
          }

          onChange(event.target.value);
        }}
        className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />

      {field.helpText ? (
        <span id={helpId} className="text-sm leading-6 text-slate-500">
          {field.helpText}
        </span>
      ) : null}
    </label>
  );
}
