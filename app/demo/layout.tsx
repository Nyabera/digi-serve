import type { ReactNode } from "react";

import { DemoStateProvider } from "@/features/demo/state";

export default function DemoLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return <DemoStateProvider>{children}</DemoStateProvider>;
}
