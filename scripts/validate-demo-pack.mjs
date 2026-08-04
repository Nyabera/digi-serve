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

function registerTypeScript() {
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
        resolveJsonModule: true,
      },
    });

    module._compile(output.outputText, filename);
  };

  require.extensions[".ts"] = compile;
  require.extensions[".tsx"] = compile;
}

function findPackExport(moduleExports, packId) {
  return Object.values(moduleExports).find(
    (value) =>
      value &&
      typeof value === "object" &&
      value.id === packId &&
      Array.isArray(value.services) &&
      Array.isArray(value.workflows),
  );
}

function configuredAssetExists(
  packDirectory,
  configuredPath,
) {
  const normalized = configuredPath.replace(
    /^\/+/,
    "",
  );
  const packRelative = configuredPath.replace(
    /^assets\//,
    "",
  );

  const candidates = [
    path.join(root, normalized),
    path.join(root, "public", normalized),
    path.join(
      packDirectory,
      "assets",
      packRelative,
    ),
    path.join(packDirectory, configuredPath),
  ];

  return candidates.some((candidate) =>
    fs.existsSync(candidate),
  );
}

function printHumanResult(pack, result) {
  console.log(
    `Validating Demo Pack: ${pack.id} ` +
      `(${pack.version})`,
  );

  for (const issue of result.issues) {
    const label =
      issue.level === "error"
        ? "ERROR"
        : "WARNING";

    console.log(
      `${label} [${issue.code}] ` +
        `${issue.path}: ${issue.message}`,
    );
  }

  console.log("");
  console.log(`Errors: ${result.errors.length}`);
  console.log(`Warnings: ${result.warnings.length}`);
  console.log(
    result.valid
      ? "PASS: Demo Pack configuration is valid."
      : "FAIL: Demo Pack configuration is invalid.",
  );
}

registerTypeScript();

const args = process.argv.slice(2);
const json = args.includes("--json");
const packId =
  args.find((argument) => !argument.startsWith("-")) ??
  "tvet";
const packDirectory = path.join(
  root,
  "demo-packs",
  packId,
);
const manifestPath = path.join(
  packDirectory,
  "manifest.ts",
);

if (!fs.existsSync(manifestPath)) {
  console.error(
    `Demo Pack manifest not found: ${manifestPath}`,
  );
  process.exit(1);
}

const moduleExports = require(manifestPath);
const pack = findPackExport(moduleExports, packId);

if (!pack) {
  console.error(
    `No Demo Pack export with ID "${packId}" ` +
      `was found in ${manifestPath}.`,
  );
  process.exit(1);
}

const validationModule = require(
  path.join(
    root,
    "features/demo-engine/config/" +
      "demo-pack-validation.ts",
  ),
);

const result = validationModule.validateDemoPack(
  pack,
  {
    assetExists: (configuredPath) =>
      configuredAssetExists(
        packDirectory,
        configuredPath,
      ),
  },
);

if (json) {
  console.log(
    JSON.stringify(
      {
        pack: {
          id: pack.id,
          version: pack.version,
        },
        ...result,
      },
      null,
      2,
    ),
  );
} else {
  printHumanResult(pack, result);
}

process.exit(result.valid ? 0 : 1);
