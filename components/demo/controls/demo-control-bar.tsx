"use client";

import { getDefaultDemoClient } from "@/config/demo";
import { HomepageVariantSwitcher } from "@/components/demo/controls/homepage-variant-switcher";
import { PresentationControls } from "@/components/demo/controls/presentation-controls";
import { RequestSwitcher } from "@/components/demo/controls/request-switcher";
import { RoleSwitcher } from "@/components/demo/controls/role-switcher";

export function DemoControlBar() {
  const client = getDefaultDemoClient();

  return (
    <aside
      aria-label="Demo presentation controls"
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur"
    >
      <div className="mx-auto flex min-h-16 max-w-[1600px] items-center gap-5 overflow-x-auto px-4 py-3 sm:px-6">
        <div className="flex min-w-max items-center gap-3 border-r border-slate-200 pr-5">
          <div
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white"
          >
            {client.branding.logoMark}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-950">
              FAIDIA Demo
            </p>
            <p className="text-[11px] text-slate-500">
              {client.organization.shortName}
            </p>
          </div>
        </div>

        {client.homepage.showVariantSwitcher ? (
          <HomepageVariantSwitcher />
        ) : null}

        {client.presentation.showRoleSwitcher ? (
          <RoleSwitcher />
        ) : null}

        <RequestSwitcher />

        {client.presentation.showPresentationControls ? (
          <div className="ml-auto">
            <PresentationControls />
          </div>
        ) : null}
      </div>
    </aside>
  );
}
