#!/usr/bin/env node

import {
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const root = process.cwd();
const appRoot = path.join(
  root,
  "app",
  "demo",
);

const outputPath = path.join(
  root,
  "docs",
  "demo-engine-base",
  "d30-freeze",
  "D30-12-ROUTE-MANIFEST.json",
);

function readOptional(relativePath) {
  try {
    return readFileSync(
      path.join(root, relativePath),
      "utf8",
    );
  } catch {
    return "";
  }
}

function firstMatch(
  source,
  expressions,
  fallback,
) {
  for (const expression of expressions) {
    const match = source.match(expression);

    if (match?.[1]) {
      return match[1];
    }
  }

  return fallback;
}

const manifestSource = readOptional(
  "demo-packs/tvet/manifest.ts",
);
const serviceSource = readOptional(
  "demo-packs/tvet/services.ts",
);
const workflowSource = readOptional(
  "demo-packs/tvet/workflows.ts",
);
const documentSource = readOptional(
  "demo-packs/tvet/documents.ts",
);

const defaultRequestId = firstMatch(
  manifestSource,
  [
    /\bdefaultRequestId\s*:\s*["']([^"']+)["']/,
  ],
  "STC-CL-2026-0027",
);

const defaultRole = firstMatch(
  manifestSource,
  [
    /\bdefaultRole\s*:\s*["']([^"']+)["']/,
  ],
  "applicant",
);

const defaultRoute = firstMatch(
  manifestSource,
  [
    /\bdefaultRoute\s*:\s*["']([^"']+)["']/,
  ],
  "/demo",
);

const firstServiceId = firstMatch(
  serviceSource,
  [
    /\bid\s*:\s*["']([^"']+)["']/,
  ],
  "transcript-request",
);

const firstWorkflowId = firstMatch(
  workflowSource,
  [
    /\bid\s*:\s*["']([^"']+)["']/,
  ],
  "transcript-request",
);

const firstDocumentId = firstMatch(
  documentSource,
  [
    /\bid\s*:\s*["']([^"']+)["']/,
  ],
  "DOC-2026-0001",
);

function walk(directory) {
  const entries = readdirSync(
    directory,
  );

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(
      directory,
      entry,
    );

    const details = statSync(
      fullPath,
    );

    if (details.isDirectory()) {
      files.push(
        ...walk(fullPath),
      );
    } else if (
      details.isFile()
      && entry === "page.tsx"
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function roleForRoute(route) {
  if (
    route === "/demo/track"
    || route.startsWith(
      "/demo/applicant",
    )
  ) {
    return "applicant";
  }

  if (
    route.startsWith(
      "/demo/officer",
    )
  ) {
    return "officer";
  }

  if (
    route.startsWith(
      "/demo/supervisor",
    )
  ) {
    return "supervisor";
  }

  if (
    route.startsWith(
      "/demo/admin",
    )
  ) {
    return "admin";
  }

  return "public";
}

function categoryForRoute(route) {
  if (
    route === "/demo"
    || route.startsWith(
      "/demo/services",
    )
    || route.startsWith(
      "/demo/sign-up",
    )
    || route.startsWith(
      "/demo/apply",
    )
    || route.startsWith(
      "/demo/verify-certificate",
    )
  ) {
    return "public";
  }

  const role = roleForRoute(route);

  return role === "public"
    ? "shared"
    : role;
}

function routeFromFile(file) {
  const relative = path.relative(
    path.join(root, "app"),
    file,
  );

  const source = readFileSync(
    file,
    "utf8",
  );

  const originalSegments = relative
    .split(path.sep)
    .slice(0, -1);

  const segments = [];
  const unresolvedSegments = [];
  let dynamic = false;

  for (const segment of originalSegments) {
    if (
      segment.startsWith("(")
      && segment.endsWith(")")
    ) {
      continue;
    }

    if (
      segment.startsWith("@")
      || segment.startsWith("_")
    ) {
      continue;
    }

    const optionalCatchAll =
      segment.match(
        /^\[\[\.\.\.(.+)\]\]$/,
      );

    const catchAll =
      segment.match(
        /^\[\.\.\.(.+)\]$/,
      );

    const dynamicSegment =
      segment.match(
        /^\[(.+)\]$/,
      );

    if (
      optionalCatchAll
      || catchAll
    ) {
      unresolvedSegments.push(
        segment,
      );
      continue;
    }

    if (dynamicSegment) {
      dynamic = true;
      const key =
        dynamicSegment[1];

      const replacements = {
        requestId: defaultRequestId,
        requestCode: defaultRequestId,
        serviceId: firstServiceId,
        workflowId: firstWorkflowId,
        documentId: firstDocumentId,
        certificateId: firstDocumentId,
      };

      const replacement =
        replacements[key];

      if (!replacement) {
        unresolvedSegments.push(
          segment,
        );
        continue;
      }

      segments.push(
        encodeURIComponent(
          replacement,
        ),
      );
      continue;
    }

    segments.push(segment);
  }

  if (unresolvedSegments.length) {
    return {
      unresolved: true,
      source:
        path.relative(
          root,
          file,
        ),
      pattern:
        "/"
        + originalSegments
          .filter(
            (segment) =>
              !(
                segment.startsWith("(")
                && segment.endsWith(")")
              ),
          )
          .join("/"),
      unresolvedSegments,
    };
  }

  const route =
    "/" + segments.join("/");

  const capabilityText =
    source.toLowerCase();

  return {
    unresolved: false,
    path: route,
    source:
      path.relative(
        root,
        file,
      ),
    dynamic,
    expectedRole:
      roleForRoute(route),
    category:
      categoryForRoute(route),
    capabilities: {
      referral:
        /refer|referral|share-workflow/.test(
          capabilityText,
        ),
      sla:
        /sla/.test(
          capabilityText,
        )
        || route.includes(
          "sla",
        ),
      report:
        /report/.test(
          capabilityText,
        )
        || route.includes(
          "report",
        ),
      workflowBuilder:
        route.includes(
          "/workflows/builder",
        ),
    },
  };
}

const pageFiles = walk(appRoot);
const resolved = [];
const unresolved = [];

for (const file of pageFiles) {
  const record =
    routeFromFile(file);

  if (record.unresolved) {
    unresolved.push(record);
  } else {
    resolved.push(record);
  }
}

const registrySource = readOptional(
  "features/demo-engine/navigation/demo-route-registry.ts",
);

const registryRoutes = Array.from(
  registrySource.matchAll(
    /["'](\/demo\/[^"'`$?]*)["']/g,
  ),
  (match) => match[1],
)
  .filter(
    (route) =>
      !route.includes("[")
      && !route.includes(":"),
  );

const byPath = new Map();

for (const route of resolved) {
  byPath.set(
    route.path,
    route,
  );
}

const concreteRegistryRoutes = [];

for (const route of registryRoutes) {
  if (byPath.has(route)) {
    concreteRegistryRoutes.push(
      route,
    );
  }
}

const evidenceRoutes = new Set([
  "/demo",
  "/demo/verify-certificate",
  "/demo/track",
  "/demo/applicant/profile",
  "/demo/applicant/documents",
  "/demo/officer",
  "/demo/officer/documents",
  "/demo/officer/sla-monitor",
  "/demo/supervisor",
  "/demo/admin",
  "/demo/admin/workflows",
  "/demo/admin/workflows/builder",
]);

const routes = Array.from(
  byPath.values(),
)
  .sort(
    (left, right) =>
      left.path.localeCompare(
        right.path,
      ),
  )
  .map(
    (route) => ({
      ...route,
      captureEvidence:
        evidenceRoutes.has(
          route.path,
        )
        || (
          route.path.startsWith(
            "/demo/track/",
          )
          && route.path.includes(
            encodeURIComponent(
              defaultRequestId,
            ),
          )
        ),
    }),
  );

const paths = new Set(
  routes.map(
    (route) => route.path,
  ),
);

const trackingRoutes = routes
  .filter(
    (route) =>
      route.path.startsWith(
        "/demo/track/",
      ),
  )
  .map(
    (route) => route.path,
  );

const canonicalTrackingRoute =
  trackingRoutes.find(
    (route) =>
      route.includes(
        encodeURIComponent(
          defaultRequestId,
        ),
      ),
  )
  ?? trackingRoutes[0]
  ?? null;

const requestWorkspace = routes.find(
  (route) =>
    route.path.includes(
      `/requests/${encodeURIComponent(defaultRequestId)}`,
    ),
);

const referralRoute = requestWorkspace
  ? `${requestWorkspace.path}?view=refer`
  : null;

const reportRoutes = routes
  .filter(
    (route) =>
      route.capabilities.report
      || route.path.includes(
        "report",
      ),
  )
  .map(
    (route) => route.path,
  );

const slaRoutes = routes
  .filter(
    (route) =>
      route.capabilities.sla
      || route.path.includes(
        "sla",
      ),
  )
  .map(
    (route) => route.path,
  );

const manifest = {
  stage: "D30-12",
  generatedFrom:
    "app/demo/**/page.tsx",
  defaults: {
    requestId:
      defaultRequestId,
    role:
      defaultRole,
    route:
      defaultRoute,
    serviceId:
      firstServiceId,
    workflowId:
      firstWorkflowId,
    documentId:
      firstDocumentId,
  },
  totals: {
    pageFiles:
      pageFiles.length,
    resolvedRoutes:
      routes.length,
    unresolvedDynamicRoutes:
      unresolved.length,
    registryBackedRoutes:
      concreteRegistryRoutes.length,
  },
  requiredJourneys: {
    publicHome:
      paths.has("/demo"),
    verification:
      paths.has(
        "/demo/verify-certificate",
      ),
    applicantTracking:
      paths.has(
        "/demo/track",
      )
      || trackingRoutes.length > 0,
    applicantProfile:
      paths.has(
        "/demo/applicant/profile",
      ),
    applicantDocuments:
      paths.has(
        "/demo/applicant/documents",
      ),
    officerHome:
      paths.has(
        "/demo/officer",
      ),
    officerDocuments:
      paths.has(
        "/demo/officer/documents",
      ),
    officerSla:
      paths.has(
        "/demo/officer/sla-monitor",
      ),
    supervisorHome:
      paths.has(
        "/demo/supervisor",
      ),
    adminHome:
      paths.has(
        "/demo/admin",
      ),
    adminWorkflows:
      paths.has(
        "/demo/admin/workflows",
      ),
    adminBuilder:
      paths.has(
        "/demo/admin/workflows/builder",
      ),
    referral:
      Boolean(referralRoute),
    reports:
      reportRoutes.length > 0,
  },
  targetedRoutes: {
    referral:
      referralRoute,
    reports:
      reportRoutes,
    sla:
      slaRoutes,
    tracking:
      canonicalTrackingRoute,
  },
  registryRoutes:
    concreteRegistryRoutes,
  routes,
  unresolved,
};

writeFileSync(
  outputPath,
  JSON.stringify(
    manifest,
    null,
    2,
  ) + "\n",
);

console.log(
  `PASS: Generated ${routes.length} concrete Demo routes`,
);

if (unresolved.length) {
  console.log(
    `NOTICE: ${unresolved.length} dynamic route files require manual seeded values`,
  );
}
