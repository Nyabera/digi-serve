import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const demoRoot = path.join(root, "app", "demo");

const expectedPages = [
  "app/demo/apply/[serviceSlug]/page.tsx",
  "app/demo/department/handoffs/[handoffId]/page.tsx",
  "app/demo/department/page.tsx",
  "app/demo/officer/page.tsx",
  "app/demo/officer/requests/[requestId]/page.tsx",
  "app/demo/outcomes/[requestId]/page.tsx",
  "app/demo/page.tsx",
  "app/demo/reports/page.tsx",
  "app/demo/requests/[requestId]/confirmation/page.tsx",
  "app/demo/services/[serviceSlug]/page.tsx",
  "app/demo/sign-up/page.tsx",
  "app/demo/supervisor/approvals/[requestId]/page.tsx",
  "app/demo/supervisor/page.tsx",
  "app/demo/track/[requestId]/page.tsx",
].sort();

function walk(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const target = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return walk(target);
      }

      return path.basename(target) === "page.tsx"
        ? [target]
        : [];
    });
}

function relative(file) {
  return path
    .relative(root, file)
    .split(path.sep)
    .join("/");
}

function routeFromPage(file) {
  const relativePage = relative(file);
  const withoutPrefix = relativePage
    .replace(/^app/, "")
    .replace(/\/page\.tsx$/, "");

  const route = withoutPrefix
    .split("/")
    .filter(Boolean)
    .filter(
      (segment) =>
        !segment.startsWith("(") &&
        !segment.startsWith("@"),
    )
    .join("/");

  return `/${route}`;
}

const actualFiles = walk(demoRoot)
  .map(relative)
  .sort();

const missing = expectedPages.filter(
  (file) => !actualFiles.includes(file),
);

const unexpected = actualFiles.filter(
  (file) => !expectedPages.includes(file),
);

const routeMap = new Map();

for (const file of walk(demoRoot)) {
  const route = routeFromPage(file);
  const existing = routeMap.get(route) ?? [];

  existing.push(relative(file));
  routeMap.set(route, existing);
}

const collisions = [...routeMap.entries()].filter(
  ([, filesForRoute]) => filesForRoute.length > 1,
);

const missingDefaultExports = actualFiles.filter(
  (file) => {
    const text = fs.readFileSync(
      path.join(root, file),
      "utf8",
    );

    return !/\bexport\s+default\b/.test(text);
  },
);

console.log("FAIDIA D29 route inventory audit");
console.log("================================");
console.log(`Expected route pages: ${expectedPages.length}`);
console.log(`Actual route pages:   ${actualFiles.length}`);

console.log("\nResolved routes:");

for (const [route, filesForRoute] of [
  ...routeMap.entries(),
].sort(([left], [right]) =>
  left.localeCompare(right),
)) {
  console.log(
    `PASS: ${route} -> ${filesForRoute.join(", ")}`,
  );
}

let failed = false;

if (missing.length > 0) {
  failed = true;
  console.error("\nMissing route pages:");

  for (const file of missing) {
    console.error(`FAIL: ${file}`);
  }
}

if (unexpected.length > 0) {
  failed = true;
  console.error("\nUnexpected route pages:");

  for (const file of unexpected) {
    console.error(`FAIL: ${file}`);
  }
}

if (collisions.length > 0) {
  failed = true;
  console.error("\nRoute collisions:");

  for (const [route, filesForRoute] of collisions) {
    console.error(
      `FAIL: ${route} is defined by ${filesForRoute.join(
        ", ",
      )}`,
    );
  }
}

if (missingDefaultExports.length > 0) {
  failed = true;
  console.error("\nPages missing a default export:");

  for (const file of missingDefaultExports) {
    console.error(`FAIL: ${file}`);
  }
}

if (
  actualFiles.some((file) =>
    file.startsWith("app/demo/outcome/"),
  )
) {
  failed = true;
  console.error(
    '\nFAIL: The obsolete singular "/demo/outcome" route still exists.',
  );
}

if (failed) {
  process.exit(1);
}

console.log("\nD29 ROUTE INVENTORY AUDIT PASSED");
