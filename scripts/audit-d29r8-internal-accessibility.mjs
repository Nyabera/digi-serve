import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const targets = [
  "components/demo/officer",
  "components/demo/department",
  "components/demo/supervisor",
  "components/demo/reports",
  "components/demo/outcomes",
  "features/officer-dashboard",
  "features/officer-review",
  "features/department-handoffs",
  "features/supervisor-approvals",
];

const failures = [];
const warnings = [];

function walk(targetPath) {
  const absolute = path.join(root, targetPath);

  if (!fs.existsSync(absolute)) {
    return [];
  }

  const stat = fs.statSync(absolute);

  if (stat.isFile()) {
    return [targetPath];
  }

  return fs
    .readdirSync(absolute, { withFileTypes: true })
    .flatMap((entry) =>
      walk(path.join(targetPath, entry.name)),
    );
}

const files = targets
  .flatMap(walk)
  .filter((file) =>
    /\.(tsx|ts|css)$/.test(file),
  );

if (files.length === 0) {
  failures.push(
    "No redesigned internal feature files were found.",
  );
}

let combinedTsx = "";
let combinedCss = "";

for (const file of files) {
  const content = fs.readFileSync(
    path.join(root, file),
    "utf8",
  );

  if (file.endsWith(".tsx")) {
    combinedTsx += `\n/* ${file} */\n${content}`;

    const buttonMatches =
      content.matchAll(
        /<button\b([^>]*)>([\s\S]*?)<\/button>/g,
      );

    for (const match of buttonMatches) {
      const attributes = match[1];
      const body = match[2]
        .replace(/<[^>]+>/g, " ")
        .replace(/\{[^}]*\}/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const hasAccessibleName =
        /\baria-label\s*=/.test(attributes) ||
        /\baria-labelledby\s*=/.test(attributes) ||
        body.length > 0;

      if (!hasAccessibleName) {
        warnings.push(
          `${file}: button may not have an accessible name.`,
        );
      }
    }

    const targetBlankMatches =
      content.matchAll(
        /<a\b([^>]*\btarget=["']_blank["'][^>]*)>/g,
      );

    for (const match of targetBlankMatches) {
      if (
        !/\brel=["'][^"']*noopener/.test(
          match[1],
        )
      ) {
        warnings.push(
          `${file}: target="_blank" link may be missing rel="noopener noreferrer".`,
        );
      }
    }

    const imageMatches =
      content.matchAll(
        /<(?:img|Image)\b([^>]*)>/g,
      );

    for (const match of imageMatches) {
      if (!/\balt\s*=/.test(match[1])) {
        warnings.push(
          `${file}: image-like element may be missing alt text.`,
        );
      }
    }

    if (
      /\bonClick\s*=/.test(content) &&
      /<(?:div|span|li)\b[^>]*\bonClick\s*=/.test(
        content,
      )
    ) {
      warnings.push(
        `${file}: non-control element uses onClick; verify keyboard support.`,
      );
    }
  }

  if (file.endsWith(".css")) {
    combinedCss += `\n/* ${file} */\n${content}`;
  }
}

const criticalChecks = [
  {
    label: "accessible table names",
    passed:
      /<table[\s\S]*?aria-label=/.test(
        combinedTsx,
      ),
  },
  {
    label: "search landmark",
    passed: /role=["']search["']/.test(
      combinedTsx,
    ),
  },
  {
    label: "status live region",
    passed: /role=["']status["']/.test(
      combinedTsx,
    ),
  },
  {
    label: "error live region",
    passed: /role=["']alert["']/.test(
      combinedTsx,
    ),
  },
  {
    label: "screen-reader-only labels",
    passed: /\bsr-only\b/.test(
      combinedTsx,
    ),
  },
  {
    label: "responsive feature CSS",
    passed:
      (
        combinedCss.match(
          /@media\s*\(\s*max-width/g,
        ) ?? []
      ).length >= 8,
  },
];

for (const check of criticalChecks) {
  if (!check.passed) {
    failures.push(
      `Missing critical accessibility capability: ${check.label}`,
    );
  }
}

if (failures.length > 0) {
  console.error(
    "\nD29R-8 internal accessibility audit failed:\n",
  );

  for (const failure of failures) {
    console.error(`  ✗ ${failure}`);
  }

  if (warnings.length > 0) {
    console.error("\nWarnings:");
    for (const warning of warnings) {
      console.error(`  ! ${warning}`);
    }
  }

  process.exit(1);
}

console.log(
  "\nD29R-8 internal accessibility audit passed.",
);
console.log(
  `  ✓ Scanned ${files.length} redesigned internal files`,
);

for (const check of criticalChecks) {
  console.log(`  ✓ ${check.label}`);
}

if (warnings.length > 0) {
  console.log(
    `\nReview ${warnings.length} non-blocking warning(s):`,
  );
  for (const warning of warnings) {
    console.log(`  ! ${warning}`);
  }
} else {
  console.log(
    "  ✓ No heuristic warnings found",
  );
}
