"use client";

import {
  createContext,
  type ReactNode,
  useContext,
} from "react";

import type { DemoPack } from "./demo-pack.types";

const DemoPackContext = createContext<DemoPack | null>(null);

export function DemoPackProvider({
  children,
  pack,
}: {
  readonly children: ReactNode;
  readonly pack: DemoPack;
}) {
  return (
    <DemoPackContext.Provider value={pack}>
      {children}
    </DemoPackContext.Provider>
  );
}

export function useDemoPack(): DemoPack {
  const pack = useContext(DemoPackContext);

  if (!pack) {
    throw new Error(
      "useDemoPack must be used inside DemoPackProvider.",
    );
  }

  return pack;
}

export function useDemoOrganization() {
  return useDemoPack().organization;
}

export function useDemoBranding() {
  return useDemoPack().branding;
}

export function useDemoHomepage() {
  return useDemoPack().homepage;
}

export function useDemoDepartments() {
  return useDemoPack().departments;
}

export function useDemoUsers() {
  return useDemoPack().users;
}

export function useDemoServices() {
  return useDemoPack().services;
}

export function useDemoWorkflows() {
  return useDemoPack().workflows;
}

export function useDemoDocuments() {
  return useDemoPack().documents;
}

export function useDemoRequests() {
  return useDemoPack().requests;
}

export function useDemoReports() {
  return useDemoPack().reports;
}

export function useDemoSla() {
  return useDemoPack().sla;
}

export function useDemoPackSelector<Result>(
  selector: (pack: DemoPack) => Result,
): Result {
  return selector(useDemoPack());
}
