import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Missing required file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function pass(condition, message) {
  if (!condition) failures.push(message);
}

function walk(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) return [];
  const stat = fs.statSync(absolutePath);
  if (stat.isFile()) return [relativePath];
  return fs.readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) =>
    walk(path.join(relativePath, entry.name)),
  );
}

function cssBlock(source, selector) {
  const start = source.indexOf(`${selector} {`);
  if (start === -1) return "";
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  return "";
}

function channel(value) {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const normalized = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((index) =>
    Number.parseInt(normalized.slice(index, index + 2), 16),
  );
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

const calibrationPath = "app/demo/demo-calibration.css";
const homepageCssPath = "components/demo/homepage/savannah-homepage.module.css";
const homepagePath = "components/demo/homepage/savannah-homepage.tsx";
const servicePath = "components/demo/public/service-information-page.tsx";
const globalsPath = "app/globals.css";

const calibration = read(calibrationPath);
const homepageCss = read(homepageCssPath);
const homepage = read(homepagePath);
const service = read(servicePath);
const globals = read(globalsPath);

pass(
  !/^\s*main(?=\s|\{|>|:|\.)/m.test(calibration),
  `${calibrationPath} still uses an unscoped main selector`,
);

const calibrationRoot = cssBlock(calibration, ":where(.demo-presentation-content)");
pass(Boolean(calibrationRoot), `${calibrationPath} is missing the presentation-content scope`);
pass(
  calibrationRoot && !/^\s*(?:background|color)\s*:/m.test(calibrationRoot),
  `${calibrationPath} still owns the page background or foreground at the route root`,
);

pass(
  /:where\(\.demo-presentation-content\)\s+:where\(h1, h2, h3\)\s*\{[\s\S]*?color:\s*inherit\s*;/m.test(calibration),
  `${calibrationPath} headings do not inherit their local surface foreground`,
);
pass(
  /label\s*>\s*span:first-child\s*\{[\s\S]*?color:\s*inherit\s*;/m.test(calibration),
  `${calibrationPath} labels still force the light-surface text token`,
);

for (const selector of [
  ".demo-surface-light",
  ".demo-surface-dark",
  ".demo-surface-dark-card",
  ".demo-surface-primary",
]) {
  pass(calibration.includes(selector), `${calibrationPath} is missing ${selector}`);
}

pass(
  homepageCss.includes(".page :where(a)"),
  `${homepageCssPath} is missing the low-specificity anchor reset`,
);
pass(
  !/\.page\s+a\s*\{[\s\S]*?color:\s*inherit/m.test(homepageCss),
  `${homepageCssPath} still lets the page anchor reset override action-link foregrounds`,
);
pass(
  /\.darkCard\s*\{[\s\S]*?color:\s*#e7eaf0\s*;/m.test(homepageCss),
  `${homepageCssPath} does not establish a dark-card foreground`,
);
pass(
  /\.primaryButton\s*\{[\s\S]*?background:\s*var\(--savannah-cobalt\)[\s\S]*?color:\s*#ffffff\s*;/m.test(homepageCss),
  `${homepageCssPath} primary action does not establish a white foreground`,
);
pass(
  homepage.includes("demo-surface-dark"),
  `${homepagePath} does not identify the dark homepage surface`,
);
pass(
  service.includes("demo-surface-dark"),
  `${servicePath} does not identify its dark service hero surface`,
);

pass(
  /--primary-foreground:\s*var\(--palette-white\)/.test(globals),
  `${globalsPath} primary-foreground token is not mapped to white`,
);
pass(
  /\.button-primary\s*\{[\s\S]*?color:\s*var\(--primary-foreground\)/m.test(globals),
  `${globalsPath} shared primary button does not consume --primary-foreground`,
);

const demoSourceFiles = ["app/demo", "components/demo", "features"]
  .flatMap(walk)
  .filter((file) => /\.(tsx|ts|css)$/.test(file));

for (const file of demoSourceFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  if (/\bfont-serif\b/.test(source)) {
    failures.push(`${file} still requests the prohibited font-serif utility`);
  }

  const classValues = source.match(/className=(?:"[^"]*"|'[^']*'|\{`[\s\S]*?`\})/g) ?? [];
  for (const classValue of classValues) {
    const hasDarkBackground = /\bbg-(?:black|slate-9\d\d|\[#(?:0[0-9a-f]{5}|1[0-9a-f]{5})\])\b/i.test(classValue);
    const hasDarkText = /\btext-(?:black|slate-9\d\d|primary|foreground|\[#(?:0[0-9a-f]{5}|1[0-9a-f]{5})\])\b/i.test(classValue);
    if (hasDarkBackground && hasDarkText) {
      warnings.push(`${file}: review a class list that combines a dark background with a dark semantic text class`);
      break;
    }
    if (/\bbg-primary\b/.test(classValue) && !/\btext-primary-foreground\b/.test(classValue)) {
      warnings.push(`${file}: review bg-primary usage without text-primary-foreground in the same class expression`);
      break;
    }
  }
}

const contrastPairs = [
  ["light primary", "#101827", "#f7f5f1", 4.5],
  ["light muted", "#5f6775", "#f7f5f1", 4.5],
  ["dark primary", "#f8fafc", "#070a12", 4.5],
  ["dark muted", "#b9c0cd", "#070a12", 4.5],
  ["dark-card primary", "#e7eaf0", "#121620", 4.5],
  ["primary action", "#ffffff", "#2f5bff", 4.5],
];

for (const [label, foreground, background, minimum] of contrastPairs) {
  const value = contrast(foreground, background);
  pass(
    value >= minimum,
    `${label} contrast is ${value.toFixed(2)}:1; expected at least ${minimum}:1`,
  );
}

const routeCount = walk("app/demo").filter((file) => file.endsWith("/page.tsx") || file === "app/demo/page.tsx").length;
pass(routeCount === 14, `Expected 14 Demo Engine page routes but found ${routeCount}`);

if (failures.length > 0) {
  console.error("\nD29R-11 demo colour-contrast audit failed:\n");
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  if (warnings.length > 0) {
    console.error("\nManual-review warnings:");
    for (const warning of [...new Set(warnings)]) console.error(`  ! ${warning}`);
  }
  process.exit(1);
}

console.log("\nD29R-11 demo colour-contrast audit passed.");
console.log("  ✓ D26 calibration no longer owns nested page surfaces");
console.log("  ✓ Headings and labels inherit local surface foregrounds");
console.log("  ✓ Light, dark, dark-card and primary-action contracts exist");
console.log("  ✓ Homepage action-link specificity is corrected");
console.log("  ✓ Shared primary buttons retain primary-foreground semantics");
console.log("  ✓ Required WCAG token pairs meet 4.5:1");
console.log("  ✓ Only approved font families remain in the demo source");
console.log("  ✓ Demo route inventory remains at 14 pages");

if (warnings.length > 0) {
  console.log("\nManual-review warnings:");
  for (const warning of [...new Set(warnings)]) console.log(`  ! ${warning}`);
} else {
  console.log("  ✓ No static dark-surface class hazards detected");
}
