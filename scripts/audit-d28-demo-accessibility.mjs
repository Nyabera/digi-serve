import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const demoRoot = path.join(root, "app", "demo");
const componentRoot = path.join(
  root,
  "components",
  "demo",
);

function walk(directory, predicate) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, {
      withFileTypes: true,
    })
    .flatMap((entry) => {
      const target = path.join(
        directory,
        entry.name,
      );

      if (entry.isDirectory()) {
        return walk(target, predicate);
      }

      return predicate(target) ? [target] : [];
    });
}

function relative(file) {
  return path.relative(root, file);
}

function lineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

const routePages = walk(
  demoRoot,
  (file) => path.basename(file) === "page.tsx",
);

const sourceFiles = [
  ...walk(
    demoRoot,
    (file) =>
      file.endsWith(".tsx") ||
      file.endsWith(".ts"),
  ),
  ...walk(
    componentRoot,
    (file) =>
      file.endsWith(".tsx") ||
      file.endsWith(".ts"),
  ),
];

const hardFailures = [];
const warnings = [];

if (routePages.length !== 14) {
  hardFailures.push(
    `Expected 14 demo route pages but found ${routePages.length}.`,
  );
}

const layoutFile = path.join(
  demoRoot,
  "layout.tsx",
);
const layoutText = fs.readFileSync(
  layoutFile,
  "utf8",
);

if (
  !layoutText.includes(
    'href="#demo-main-content"',
  )
) {
  hardFailures.push(
    "Demo layout does not contain the skip-to-content link.",
  );
}

const frameFile = path.join(
  componentRoot,
  "presentation",
  "demo-presentation-frame.tsx",
);
const frameText = fs.readFileSync(
  frameFile,
  "utf8",
);

if (
  !frameText.includes(
    'id="demo-main-content"',
  ) ||
  !frameText.includes("tabIndex={-1}")
) {
  hardFailures.push(
    "Presentation frame does not expose the focusable main-content target.",
  );
}

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");

  const imagePattern =
    /<(?:img|Image)\b[\s\S]*?>/g;

  for (
    let match = imagePattern.exec(text);
    match;
    match = imagePattern.exec(text)
  ) {
    if (!/\balt\s*=/.test(match[0])) {
      warnings.push(
        `${relative(file)}:${lineNumber(
          text,
          match.index,
        )} image-like element may be missing alt text`,
      );
    }
  }

  const blankTargetPattern =
    /<a\b[\s\S]*?target\s*=\s*["']_blank["'][\s\S]*?>/g;

  for (
    let match = blankTargetPattern.exec(text);
    match;
    match = blankTargetPattern.exec(text)
  ) {
    if (
      !/\brel\s*=\s*["'][^"']*(?:noopener|noreferrer)/.test(
        match[0],
      )
    ) {
      warnings.push(
        `${relative(file)}:${lineNumber(
          text,
          match.index,
        )} target="_blank" link may be missing rel protection`,
      );
    }
  }

  const clickableNonControlPattern =
    /<(?:div|span|article)\b[^>]*\bonClick\s*=/g;

  for (
    let match =
      clickableNonControlPattern.exec(text);
    match;
    match =
      clickableNonControlPattern.exec(text)
  ) {
    warnings.push(
      `${relative(file)}:${lineNumber(
        text,
        match.index,
      )} non-control element has onClick; verify keyboard support`,
    );
  }
}

console.log(
  "FAIDIA D28 source accessibility audit",
);
console.log(
  "====================================",
);
console.log(
  `Route pages checked: ${routePages.length}`,
);
console.log(
  `TypeScript source files checked: ${sourceFiles.length}`,
);

if (warnings.length > 0) {
  console.log("\nWarnings requiring manual review:");

  for (const warning of warnings) {
    console.log(`WARN: ${warning}`);
  }
} else {
  console.log(
    "\nPASS: No heuristic source warnings found.",
  );
}

if (hardFailures.length > 0) {
  console.error("\nHard failures:");

  for (const failure of hardFailures) {
    console.error(`FAIL: ${failure}`);
  }

  process.exit(1);
}

console.log(
  "\nD28 SOURCE ACCESSIBILITY AUDIT PASSED",
);
