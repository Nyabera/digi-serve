import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const runtimeRoots = [
  "app/demo",
  "components/demo",
  "features/demo",
  "config/demo",
  "types/demo",
];

const requiredFiles = [
  "app/demo/layout.tsx",
  "app/demo/demo-calibration.css",
  "app/demo/demo-presentation.css",
  "app/demo/demo-accessibility.css",
  "features/demo/state/index.ts",
  "config/demo/index.ts",
  "public/demo/references/homepage/primary-homepage-reference.png",
  "scripts/audit-d28-demo-accessibility.mjs",
];

const failures = [];
const warnings = [];

function walk(directory) {
  const absolute = path.join(root, directory);

  if (!fs.existsSync(absolute)) {
    return [];
  }

  return fs
    .readdirSync(absolute, {
      withFileTypes: true,
    })
    .flatMap((entry) => {
      const target = path.join(absolute, entry.name);

      if (entry.isDirectory()) {
        return walk(
          path.relative(root, target),
        );
      }

      return [target];
    });
}

function relative(file) {
  return path
    .relative(root, file)
    .split(path.sep)
    .join("/");
}

function lineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    failures.push(`Required file is missing: ${file}`);
  }
}

const sourceFiles = runtimeRoots.flatMap(walk).filter(
  (file) =>
    /\.(?:ts|tsx|js|jsx|mjs|css)$/.test(file),
);

const prohibitedPatterns = [
  {
    label: "Supabase import or client call",
    pattern:
      /from\s+["'][^"']*supabase[^"']*["']|createClient\s*\(|\bsupabase\./g,
  },
  {
    label: "Supabase environment access",
    pattern:
      /NEXT_PUBLIC_SUPABASE|SUPABASE_URL|SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE/g,
  },
  {
    label: "Network request",
    pattern:
      /\bfetch\s*\(|\baxios(?:\.|\s*\()|XMLHttpRequest|new\s+WebSocket\s*\(/g,
  },
  {
    label: "Persistent localStorage use",
    pattern: /\blocalStorage\b/g,
  },
];

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");

  for (const rule of prohibitedPatterns) {
    rule.pattern.lastIndex = 0;

    for (
      let match = rule.pattern.exec(text);
      match;
      match = rule.pattern.exec(text)
    ) {
      failures.push(
        `${relative(file)}:${lineNumber(
          text,
          match.index,
        )} ${rule.label}: ${match[0]}`,
      );
    }
  }
}

const clientConfigFiles = walk("config/demo").filter(
  (file) => /\.(?:ts|tsx)$/.test(file),
);
const clientConfigText = clientConfigFiles
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n");

if (
  !clientConfigText.includes(
    "showVariantSwitcher: false",
  )
) {
  failures.push(
    "Single-homepage scope is missing showVariantSwitcher: false.",
  );
}

if (
  !clientConfigText.includes(
    'availableVariants: ["A"]',
  )
) {
  failures.push(
    'Single-homepage scope is missing availableVariants: ["A"].',
  );
}

const layoutPath = path.join(
  root,
  "app/demo/layout.tsx",
);
const layoutText = fs.existsSync(layoutPath)
  ? fs.readFileSync(layoutPath, "utf8")
  : "";

for (const requiredImport of [
  'import "./demo-calibration.css";',
  'import "./demo-presentation.css";',
  'import "./demo-accessibility.css";',
  "DemoStateProvider",
  "DemoControlBar",
  "DemoPresentationFrame",
]) {
  if (!layoutText.includes(requiredImport)) {
    failures.push(
      `Demo layout is missing: ${requiredImport}`,
    );
  }
}

const stateFiles = walk("features/demo/state").filter(
  (file) => /\.(?:ts|tsx)$/.test(file),
);
const stateText = stateFiles
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n");

if (!stateText.includes("sessionStorage")) {
  failures.push(
    "Shared demo state does not reference sessionStorage.",
  );
}

if (
  !stateText.includes(
    "faidia.demo-engine.state.v1",
  )
) {
  failures.push(
    "Shared demo state storage key is missing.",
  );
}

const pageCount = walk("app/demo").filter(
  (file) => path.basename(file) === "page.tsx",
).length;

if (pageCount !== 14) {
  failures.push(
    `Expected 14 route pages but found ${pageCount}.`,
  );
}

const markdownFiles = walk(
  "docs/demo-engine-base",
).filter((file) => file.endsWith(".md"));

if (markdownFiles.length < 10) {
  warnings.push(
    `Only ${markdownFiles.length} Demo Engine documentation files were found.`,
  );
}

console.log("FAIDIA D29 demo-boundary audit");
console.log("==============================");
console.log(
  `Runtime source files scanned: ${sourceFiles.length}`,
);
console.log(
  `Demo documentation files:     ${markdownFiles.length}`,
);
console.log(`Route pages:                  ${pageCount}`);

for (const warning of warnings) {
  console.log(`WARN: ${warning}`);
}

if (failures.length > 0) {
  console.error("\nBoundary failures:");

  for (const failure of failures) {
    console.error(`FAIL: ${failure}`);
  }

  process.exit(1);
}

console.log(
  "\nD29 DEMO BOUNDARY AUDIT PASSED",
);
