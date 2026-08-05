import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const cssPath = resolve(
  process.cwd(),
  "components/demo/internal-shell/internal-shell.module.css",
);
const globalsPath = resolve(process.cwd(), "app/globals.css");

const css = readFileSync(cssPath, "utf8");
const globals = readFileSync(globalsPath, "utf8");

const startMarker =
  "/* D35-2 — Applicant, Officer, Supervisor, and Admin navigation refinement */";
const endMarker =
  "/* End D35-2 shared navigation refinement */";

const start = css.indexOf(startMarker);
const end = css.indexOf(endMarker);

if (start < 0 || end < 0 || end <= start) {
  throw new Error("D35-2 CSS block is missing or malformed.");
}

const block = css.slice(start, end + endMarker.length);

describe("D35-2 V3 shared navigation visuals", () => {
  it.each(["APPLICANT", "OFFICER", "SUPERVISOR", "ADMIN"])(
    "includes %s",
    (role) => {
      expect(block).toContain(
        `.shell[data-internal-shell-role="${role}"] .sidebar :global(.nav-item)`,
      );
      expect(block).toContain(
        `.shell[data-internal-shell-role="${role}"] .sidebar :global(.nav-item:not([aria-current="page"]) .nav-item-label)`,
      );
      expect(block).toContain(
        `.shell[data-internal-shell-role="${role}"] .sidebar :global(.nav-item[aria-current="page"])`,
      );
      expect(block).toContain(
        `.shell[data-internal-shell-role="${role}"] .sidebar :global(.nav-item-icon)`,
      );
    },
  );

  it("excludes Department", () => {
    expect(block).not.toContain(
      'data-internal-shell-role="DEPARTMENT"',
    );
  });

  it("sets only inactive labels to #666666", () => {
    expect(block).toContain(
      '.nav-item:not([aria-current="page"]) .nav-item-label',
    );
    expect(block).toContain("color: #666666;");
  });

  it("removes active-item corner radius", () => {
    expect(block).toContain(
      '.nav-item[aria-current="page"]',
    );
    expect(block).toContain("border-radius: 0;");
  });

  it("reduces current item height by another ten percent", () => {
    expect(block).toContain("min-height: 2.025rem;");
  });

  it("preserves V2 typography, icon, and width settings", () => {
    expect(block).toContain('"Source Code Pro Variable"');
    expect(block).toContain("font-size: 0.7125rem;");
    expect(block).toContain("letter-spacing: 0.05px;");
    expect(block).toContain("width: 1.35rem;");
    expect(block).toContain("height: 1.35rem;");
    expect(block).toContain("stroke-width: 1;");
    expect(block).toContain("14.025rem");
  });

  it("preserves global layout and control tokens", () => {
    expect(globals).toContain("--sidebar-width-staff: 16.5rem;");
    expect(globals).toContain("--control-height-compact: 2.5rem;");
  });
});
