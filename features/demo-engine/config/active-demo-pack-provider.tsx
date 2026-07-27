import type { ReactNode } from "react";

import { activeDemoPack } from "./active-demo-pack";
import { DemoPackProvider } from "./demo-pack-provider";

export function ActiveDemoPackProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <DemoPackProvider pack={activeDemoPack}>
      {children}
    </DemoPackProvider>
  );
}
