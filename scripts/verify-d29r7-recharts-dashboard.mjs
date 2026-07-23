#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const target = process.cwd();
const errors = [];
const passes = [];

function read(relativePath) {
  const absolutePath = path.join(target, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`Missing ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

const route = read("app/demo/reports/page.tsx");
const shell = read("components/demo/reports/operational-reports-shell.tsx");
const component = read("components/demo/reports/reports-dashboard.tsx");
const data = read("components/demo/reports/report-data.ts");
const css = read("components/demo/reports/reports-dashboard.module.css");
read("components/demo/reports/index.ts");

for (const chart of [
  "LineChart",
  "ComposedChart",
  "PieChart",
  "BarChart",
  "FunnelChart",
]) {
  if (!component.includes(chart)) {
    errors.push(`Missing Recharts ${chart}`);
  } else {
    passes.push(`Recharts ${chart} is present`);
  }
}

for (const text of [
  "Workload vs throughput",
  "SLA health",
  "Backlog age by department",
  "Workflow completion",
  "Needs attention",
]) {
  if (!component.includes(text)) {
    errors.push(`Missing dashboard section: ${text}`);
  }
}

if (!route.includes("OperationalReportsShell")) {
  errors.push("Reports route no longer mounts OperationalReportsShell");
}
if (!shell.includes("InternalAppShell") || !shell.includes("ReportsDashboard")) {
  errors.push("Reports shell is not connected to InternalAppShell and ReportsDashboard");
}
if (shell.includes("InternalSecondaryPageFrame")) {
  errors.push("Reports shell still renders the duplicate secondary-page header");
}
if (!component.includes('data-d29r7-recharts-dashboard="true"')) {
  errors.push("Dashboard marker is missing");
}

for (const cssToken of [
  "width: calc(100% + 64px)",
  "margin: -32px",
  "grid-template-columns: repeat(4, minmax(0, 1fr))",
  "grid-template-columns: repeat(2, minmax(0, 1fr))",
  "min-height: 338px",
  "min-height: 276px",
  "@media (max-width: 74.99rem)",
  "@media (max-width: 47.99rem)",
]) {
  if (!css.includes(cssToken)) {
    errors.push(`Missing CSS contract: ${cssToken}`);
  }
}

const openMatch = data.match(/export const OPEN_REQUESTS = (\d+);/);
const totals = [...data.matchAll(/\n\s+total: (\d+),/g)].map((match) => Number(match[1]));
if (!openMatch || totals.length !== 3) {
  errors.push("Could not verify reconciled backlog data");
} else {
  const open = Number(openMatch[1]);
  const backlog = totals.reduce((sum, value) => sum + value, 0);
  if (open !== backlog) {
    errors.push(`Open requests ${open} do not equal backlog ${backlog}`);
  } else {
    passes.push(`Data reconciles at ${open} open requests`);
  }
}

if (errors.length) {
  console.error("D29R-7 Recharts verification failed:");
  for (const error of errors) console.error(`  ✗ ${error}`);
  process.exit(1);
}

console.log("D29R-7 Recharts verification passed:");
for (const pass of passes) console.log(`  ✓ ${pass}`);
console.log("  ✓ Shared shell and body-only dashboard are connected");
console.log("  ✓ Responsive CSS and reconciled technical-college data are present");
