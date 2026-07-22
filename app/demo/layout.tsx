import type { ReactNode } from "react";

import { DemoControlBar } from "@/components/demo/controls";
import { DemoStateProvider } from "@/features/demo/state";

export default function DemoLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <DemoStateProvider>
      <DemoControlBar />
      {children}
    </DemoStateProvider>
  );
}
