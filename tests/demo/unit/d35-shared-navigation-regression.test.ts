import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const internalCss = readFileSync(
  resolve(
    process.cwd(),
    "components/demo/internal-shell/internal-shell.module.css",
  ),
  "utf8",
);

const applicantCss = readFileSync(
  resolve(
    process.cwd(),
    "features/demo-applicant/components/applicant-workspace-shell.module.css",
  ),
  "utf8",
);

describe("D35-3 navigation regression", () => {
  it("preserves the shared-shell D35 V3 values", () => {
    expect(internalCss).toContain("min-height: 2.025rem;");
    expect(internalCss).toContain("font-size: 0.7125rem;");
    expect(internalCss).toContain("letter-spacing: 0.05px;");
    expect(internalCss).toContain("color: #666666;");
    expect(internalCss).toContain("border-radius: 0;");
    expect(internalCss).toContain("width: 1.35rem;");
    expect(internalCss).toContain("stroke-width: 1;");
    expect(internalCss).toContain("14.025rem");
  });

  it("adds proportional Applicant parity", () => {
    expect(applicantCss).toContain(
      "/* D35-3 — Applicant navigation parity */",
    );
    expect(applicantCss).toContain("min-height: 35.64px;");
    expect(applicantCss).toContain('"Source Code Pro"');
    expect(applicantCss).toContain("font-size: 0.7125rem;");
    expect(applicantCss).toContain("font-weight: 400;");
    expect(applicantCss).toContain("letter-spacing: 0.05px;");
    expect(applicantCss).toContain("color: #666666;");
    expect(applicantCss).toContain("border-radius: 0;");
    expect(applicantCss).toContain("width: 17.1px;");
    expect(applicantCss).toContain("height: 17.1px;");
    expect(applicantCss).toContain("stroke-width: 1;");
    expect(applicantCss).toContain("214.2px");
  });

  it("preserves the Applicant mobile drawer width", () => {
    expect(applicantCss).toContain("width: min(286px, 86vw);");
  });
});
