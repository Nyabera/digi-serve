#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const compile = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      moduleResolution:
        ts.ModuleResolutionKind.NodeJs,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });

  module._compile(output.outputText, filename);
};

require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;

const manifest = require(
  path.join(root, "demo-packs/tvet/manifest.ts"),
);
const validator = require(
  path.join(
    root,
    "features/demo-engine/config/" +
      "demo-pack-validation.ts",
  ),
);

const pack = structuredClone(
  manifest.tvetDemoPackDraft,
);

pack.branding.primaryAccent = "not-a-color";
pack.services[1].id = pack.services[0].id;
pack.services[0].workflowId = "missing-workflow";
pack.requests[0].serviceId = "missing-service";
pack.workflows[0].steps[0].nextStepIds = [
  "missing-step",
];

const result = validator.validateDemoPack(pack, {
  assetExists: () => false,
});

const requiredCodes = [
  "INVALID_COLOR",
  "DUPLICATE_ID",
  "MISSING_WORKFLOW_REFERENCE",
  "MISSING_SERVICE_REFERENCE",
  "MISSING_STEP_REFERENCE",
  "MISSING_ASSET",
];

const foundCodes = new Set(
  result.errors.map((issue) => issue.code),
);

for (const code of requiredCodes) {
  if (!foundCodes.has(code)) {
    console.error(
      `Expected validator error was not produced: ${code}`,
    );
    process.exit(1);
  }
}

if (result.valid) {
  console.error(
    "Invalid fixture incorrectly passed validation.",
  );
  process.exit(1);
}

console.log(
  "PASS: Validator rejects malformed Demo Pack configuration.",
);
