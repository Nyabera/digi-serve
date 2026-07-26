"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

const InternalShellBoundaryContext = createContext(false);

export function useInternalShellBoundary() {
  return useContext(InternalShellBoundaryContext);
}

export function InternalShellBoundaryProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <InternalShellBoundaryContext.Provider value>
      {children}
    </InternalShellBoundaryContext.Provider>
  );
}
