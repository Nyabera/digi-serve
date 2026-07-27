#!/usr/bin/env bash
set -euo pipefail

ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
OUTPUT="${1:-docs/demo-engine-base/d30-freeze/DEMO-ENVIRONMENT.txt}"

cd "$ROOT"
mkdir -p "$(dirname "$OUTPUT")"

command_version() {
  local command_name="$1"

  if command -v "$command_name" >/dev/null 2>&1; then
    "$command_name" --version 2>/dev/null | head -1
  else
    printf "not installed\n"
  fi
}

package_value() {
  local expression="$1"

  node -e "
    const pkg = require('./package.json');
    const value = ${expression};
    process.stdout.write(String(value ?? 'not declared'));
  "
}

active_pack_value() {
  local field="$1"

  node - "$field" <<'NODE'
const fs = require("fs");

const field = process.argv[2];
const manifest = fs.readFileSync(
  "demo-packs/tvet/manifest.ts",
  "utf8",
);

const patterns = {
  id: /\bid:\s*"([^"]+)"/,
  name: /\bname:\s*"([^"]+)"/,
  version: /\bversion:\s*"([^"]+)"/,
  status: /\bstatus:\s*"([^"]+)"/,
  engineCompatibility:
    /\bengineCompatibility:\s*"([^"]+)"/,
  defaultRoute: /\bdefaultRoute:\s*"([^"]+)"/,
  defaultRole: /\bdefaultRole:\s*"([^"]+)"/,
  defaultRequestId:
    /\bdefaultRequestId:\s*"([^"]+)"/,
};

const match = patterns[field]?.exec(manifest);
process.stdout.write(match?.[1] ?? "not found");
NODE
}

tracked_environment_files="$(
  git ls-files |
  grep -E '(^|/)\.env([.]|$)|(^|/)env[.]example$' ||
  true
)"

untracked_environment_files="$(
  find . \
    -path './node_modules' -prune -o \
    -path './.next' -prune -o \
    -type f \
    \( -name '.env' -o -name '.env.*' \) \
    -print 2>/dev/null |
  sed 's#^\./##' |
  while IFS= read -r file; do
    if ! git ls-files --error-unmatch "$file" \
      >/dev/null 2>&1; then
      printf "%s\n" "$file"
    fi
  done
)"

lockfiles="$(
  for file in \
    package-lock.json \
    npm-shrinkwrap.json \
    yarn.lock \
    pnpm-lock.yaml \
    bun.lock \
    bun.lockb; do
    if [[ -f "$file" ]]; then
      printf "%s\n" "$file"
    fi
  done
)"

config_files="$(
  for file in \
    next.config.js \
    next.config.mjs \
    next.config.ts \
    tsconfig.json \
    eslint.config.js \
    eslint.config.mjs \
    eslint.config.ts \
    postcss.config.js \
    postcss.config.mjs \
    tailwind.config.js \
    tailwind.config.ts \
    drizzle.config.ts \
    jest.config.js \
    jest.config.ts \
    vitest.config.ts \
    .nvmrc \
    .node-version \
    .npmrc; do
    if [[ -f "$file" ]]; then
      printf "%s\n" "$file"
    fi
  done
)"

{
  printf "FAIDIA DEMO ENGINE — TECHNICAL ENVIRONMENT SNAPSHOT\n"
  printf "===================================================\n\n"

  printf "1. SNAPSHOT METADATA\n"
  printf '%s\n' '--------------------'
  printf "Captured local: %s\n" "$(date '+%Y-%m-%d %H:%M:%S %Z')"
  printf "Captured UTC: %s\n" "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  printf "Repository root: %s\n" "$ROOT"
  printf "Snapshot purpose: D30-6 technical environment record\n"
  printf "Final release note: regenerate this file immediately before final freeze tagging\n\n"

  printf "2. GIT STATE\n"
  printf '%s\n' '------------'
  printf "Branch: %s\n" "$(git branch --show-current)"
  printf "HEAD commit: %s\n" "$(git rev-parse HEAD)"
  printf "HEAD short: %s\n" "$(git rev-parse --short HEAD)"
  printf "HEAD subject: %s\n" "$(git log -1 --pretty=%s)"
  printf "HEAD date: %s\n" "$(git log -1 --pretty=%cI)"
  printf "Upstream: %s\n" "$(
    git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' \
      2>/dev/null || printf "not configured"
  )"
  printf "Remote names: %s\n" "$(
    git remote | paste -sd ',' - |
      sed 's/,/, /g'
  )"
  printf "Working tree at capture:\n"
  if [[ -z "$(git status --porcelain)" ]]; then
    printf "  clean\n"
  else
    git status --short | sed 's/^/  /'
  fi
  printf "\n"

  printf "3. ACTIVE DEMO PACK\n"
  printf '%s\n' '-------------------'
  printf "Pack ID: %s\n" "$(active_pack_value id)"
  printf "Pack name: %s\n" "$(active_pack_value name)"
  printf "Pack version: %s\n" "$(active_pack_value version)"
  printf "Pack status: %s\n" "$(active_pack_value status)"
  printf "Engine compatibility: %s\n" \
    "$(active_pack_value engineCompatibility)"
  printf "Default route: %s\n" \
    "$(active_pack_value defaultRoute)"
  printf "Default role: %s\n" \
    "$(active_pack_value defaultRole)"
  printf "Default request: %s\n" \
    "$(active_pack_value defaultRequestId)"
  printf "Controlled entry point: features/demo-engine/config/active-demo-pack.ts\n\n"

  printf "4. OPERATING SYSTEM\n"
  printf '%s\n' '-------------------'
  printf "Kernel: %s\n" "$(uname -sr)"
  printf "Architecture: %s\n" "$(uname -m)"
  if command -v sw_vers >/dev/null 2>&1; then
    printf "macOS product: %s\n" "$(sw_vers -productName)"
    printf "macOS version: %s\n" "$(sw_vers -productVersion)"
    printf "macOS build: %s\n" "$(sw_vers -buildVersion)"
  fi
  printf "Shell: %s\n" "${SHELL:-unknown}"
  printf "Locale: %s\n" "${LANG:-unknown}"
  printf "Timezone: %s\n\n" "$(date '+%Z %z')"

  printf "5. RUNTIME AND PACKAGE MANAGER\n"
  printf '%s\n' '------------------------------'
  printf "Node: %s\n" "$(node --version)"
  printf "npm: %s\n" "$(npm --version)"
  printf "Package name: %s\n" \
    "$(package_value "pkg.name")"
  printf "Package version: %s\n" \
    "$(package_value "pkg.version")"
  printf "Declared packageManager: %s\n" \
    "$(package_value "pkg.packageManager")"
  printf "Declared engines.node: %s\n" \
    "$(package_value "pkg.engines?.node")"
  printf "Declared engines.npm: %s\n\n" \
    "$(package_value "pkg.engines?.npm")"

  printf "6. FRAMEWORK AND KEY LIBRARIES\n"
  printf '%s\n' '------------------------------'
  node <<'NODE'
const pkg = require("./package.json");
const versions = {
  next: pkg.dependencies?.next ?? pkg.devDependencies?.next,
  react: pkg.dependencies?.react ?? pkg.devDependencies?.react,
  "react-dom":
    pkg.dependencies?.["react-dom"] ??
    pkg.devDependencies?.["react-dom"],
  typescript:
    pkg.dependencies?.typescript ??
    pkg.devDependencies?.typescript,
  recharts:
    pkg.dependencies?.recharts ??
    pkg.devDependencies?.recharts,
  tailwindcss:
    pkg.dependencies?.tailwindcss ??
    pkg.devDependencies?.tailwindcss,
  drizzle: Object.entries({
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  })
    .filter(([name]) => name.includes("drizzle"))
    .map(([name, version]) => `${name}@${version}`)
    .join(", ") || "not declared",
  supabase: Object.entries({
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  })
    .filter(([name]) => name.includes("supabase"))
    .map(([name, version]) => `${name}@${version}`)
    .join(", ") || "not declared",
  jest:
    pkg.dependencies?.jest ??
    pkg.devDependencies?.jest ??
    "not declared",
};

for (const [name, version] of Object.entries(versions)) {
  console.log(`${name}: ${version ?? "not declared"}`);
}
NODE
  printf "\n"

  printf "7. LOCKFILES AND INTEGRITY\n"
  printf '%s\n' '--------------------------'
  if [[ -n "$lockfiles" ]]; then
    printf "%s\n" "$lockfiles" | sed 's/^/Lockfile: /'
  else
    printf "Lockfile: none found\n"
  fi
  printf "package.json SHA-256: %s\n" "$(
    shasum -a 256 package.json | awk '{print $1}'
  )"
  printf "package-lock.json SHA-256: %s\n" "$(
    shasum -a 256 package-lock.json | awk '{print $1}'
  )"
  printf "package-lock tracked: %s\n\n" "$(
    git ls-files --error-unmatch package-lock.json \
      >/dev/null 2>&1 &&
      printf "yes" ||
      printf "no"
  )"

  printf "8. PROJECT CONFIGURATION FILES\n"
  printf '%s\n' '------------------------------'
  if [[ -n "$config_files" ]]; then
    printf "%s\n" "$config_files"
  else
    printf "No recognized configuration files found.\n"
  fi
  printf "\n"

  printf "9. NPM SCRIPTS\n"
  printf '%s\n' '--------------'
  node <<'NODE'
const pkg = require("./package.json");
const scripts = pkg.scripts ?? {};

for (const name of Object.keys(scripts).sort()) {
  console.log(`${name}: ${scripts[name]}`);
}
NODE
  printf "\n"

  printf "10. TOP-LEVEL DEPENDENCY TREE\n"
  printf '%s\n' '-----------------------------'
  npm ls --depth=0 2>&1 || true
  printf "\n"

  printf "11. ENVIRONMENT-FILE HYGIENE\n"
  printf '%s\n' '-----------------------------'
  printf "Tracked environment-related files:\n"
  if [[ -n "$tracked_environment_files" ]]; then
    printf "%s\n" "$tracked_environment_files" |
      sed 's/^/  /'
  else
    printf "  none\n"
  fi
  printf "Untracked local environment files detected by filename only:\n"
  if [[ -n "$untracked_environment_files" ]]; then
    printf "%s\n" "$untracked_environment_files" |
      sed 's/^/  /'
  else
    printf "  none\n"
  fi
  printf "Environment values: deliberately not captured\n"
  printf "Secrets: deliberately not captured\n\n"

  printf "12. FREEZE RULES\n"
  printf '%s\n' '----------------'
  printf '%s\n' '- Use npm and package-lock.json for this frozen Demo.'
  printf '%s\n' '- Do not run npm update during the freeze.'
  printf '%s\n' '- Do not commit .env.local or secret-bearing environment files.'
  printf '%s\n' '- Regenerate this snapshot before creating final release tags.'
  printf '%s\n' '- Record dependency changes on a separate branch.'
} > "$OUTPUT"

printf "Captured technical environment: %s\n" "$OUTPUT"
