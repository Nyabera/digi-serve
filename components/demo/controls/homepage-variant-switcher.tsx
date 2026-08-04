"use client";

import type { DemoHomepageVariant } from "@/types/demo/client-config";
import { useDemoState } from "@/features/demo/state";

const homepageVariants: readonly DemoHomepageVariant[] = [
  "A",
  "B",
  "C",
];

export function HomepageVariantSwitcher() {
  const { state, dispatch, isHydrated } = useDemoState();

  function selectVariant(variant: DemoHomepageVariant) {
    dispatch({
      type: "SET_HOMEPAGE_VARIANT",
      variant,
      at: new Date().toISOString(),
    });
  }

  return (
    <fieldset
      className="flex min-w-max items-center gap-1"
      disabled={!isHydrated}
    >
      <legend className="sr-only">Homepage design</legend>

      <span className="mr-1 text-xs font-semibold text-slate-500">
        Homepage
      </span>

      {homepageVariants.map((variant) => {
        const isActive =
          state.activeHomepageVariant === variant;

        return (
          <button
            key={variant}
            type="button"
            aria-pressed={isActive}
            onClick={() => selectVariant(variant)}
            className={[
              "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-xs font-semibold transition",
              "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
              isActive
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
            ].join(" ")}
          >
            {variant}
          </button>
        );
      })}
    </fieldset>
  );
}
