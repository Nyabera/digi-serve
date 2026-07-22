import type { ReactNode } from "react";

import { DemoPublicFooter } from "@/components/demo/shell/demo-public-footer";
import { DemoPublicHeader } from "@/components/demo/shell/demo-public-header";

type DemoPublicShellProps = {
  readonly children: ReactNode;
};

export function DemoPublicShell({
  children,
}: DemoPublicShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <a
        href="#demo-public-content"
        className="sr-only z-[60] rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <DemoPublicHeader />

      <main id="demo-public-content">{children}</main>

      <DemoPublicFooter />
    </div>
  );
}
