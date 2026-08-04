import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  OFFICER_LEGACY_ROUTE_ALIASES,
  OFFICER_ROUTE_HREFS,
} from "../../../features/demo-engine/navigation/officer-navigation-contract";

const repositoryRoot = fileURLToPath(
  new URL("../../../", import.meta.url),
);
const officerAppRoot = resolve(repositoryRoot, "app/demo/officer");
const canonicalHrefs = Object.values(OFFICER_ROUTE_HREFS);
const newCanonicalHrefs = [
  OFFICER_ROUTE_HREFS.overdueTasks,
  OFFICER_ROUTE_HREFS.workflowInbox,
  OFFICER_ROUTE_HREFS.sharedWork,
  OFFICER_ROUTE_HREFS.approvalQueue,
  OFFICER_ROUTE_HREFS.returnedToApplicant,
  OFFICER_ROUTE_HREFS.documentReview,
  OFFICER_ROUTE_HREFS.generatedPdfs,
  OFFICER_ROUTE_HREFS.issuedDocuments,
  OFFICER_ROUTE_HREFS.qrVerification,
  OFFICER_ROUTE_HREFS.applicantMessages,
  OFFICER_ROUTE_HREFS.internalNotes,
] as const;

const forbiddenPageImports = [
  "InternalAppShell",
  "RoleWorkspaceShell",
  "OperationalWorkspaceShell",
  "InternalSidebar",
  "InternalTopbar",
];

const forbiddenRedirectTargets = [
  "/demo/department",
  "/demo/supervisor",
  "/demo/admin",
  "/demo/applicant",
  "/demo/outcomes",
  "/demo/reports",
  "/demo/verify-certificate",
  '"/demo"',
  "'/demo'",
];

function pagePathFor(href: string) {
  return resolve(repositoryRoot, `app${href}`, "page.tsx");
}

function sourceFor(href: string) {
  return readFileSync(pagePathFor(href), "utf8");
}

function containsLogoutPage(directory: string): boolean {
  return readdirSync(directory, { withFileTypes: true }).some((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory()
      ? entry.name === "logout" || containsLogoutPage(path)
      : false;
  });
}

describe("D32-2 officer route surface", () => {
  it("maps all 15 canonical contract hrefs to App Router pages under the officer tree", () => {
    expect(canonicalHrefs).toHaveLength(15);

    for (const href of canonicalHrefs) {
      const pagePath = pagePathFor(href);

      expect(pagePath.startsWith(`${officerAppRoot}/`)).toBe(true);
      expect(existsSync(pagePath)).toBe(true);
    }
  });

  it("keeps every new canonical page body-only, meaningful and contract-backed", () => {
    for (const href of newCanonicalHrefs) {
      const source = sourceFor(href);

      expect(source).toContain("OFFICER_ROUTE_HREFS");
      expect(source).toMatch(/return\s*\(/);
      expect(source).not.toMatch(/coming soon|work in progress|placeholder|todo-only/i);
      expect(source).not.toMatch(/\bredirect\s*\(/);

      for (const forbiddenImport of forbiddenPageImports) {
        expect(source).not.toContain(forbiddenImport);
      }

      for (const forbiddenTarget of forbiddenRedirectTargets) {
        expect(source).not.toContain(forbiddenTarget);
      }
    }
  });

  it("retains the officer layout boundary for all canonical pages", () => {
    const layoutSource = readFileSync(
      resolve(officerAppRoot, "layout.tsx"),
      "utf8",
    );

    expect(layoutSource).toContain("OperationalWorkspaceShell");
    expect(layoutSource).toContain('role="officer"');
  });

  it("preserves both SLA compatibility redirects and the documents compatibility route", () => {
    expect(OFFICER_LEGACY_ROUTE_ALIASES).toEqual({
      "/demo/officer/sla": OFFICER_ROUTE_HREFS.sla,
      "/demo/officer/reports/sla": OFFICER_ROUTE_HREFS.sla,
    });
    expect(sourceFor("/demo/officer/sla")).toContain(
      'redirect("/demo/officer/sla-monitor")',
    );
    expect(sourceFor("/demo/officer/reports/sla")).toContain(
      'redirect("/demo/officer/sla-monitor")',
    );
    expect(existsSync(resolve(officerAppRoot, "documents/page.tsx"))).toBe(
      true,
    );
  });

  it("does not add an officer logout route", () => {
    expect(containsLogoutPage(officerAppRoot)).toBe(false);
  });
});
