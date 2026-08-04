#!/usr/bin/env bash
set -euo pipefail

required=(
  "components/demo/role-switch/demo-role-navigation-bridge.tsx"
  "features/demo-admin-workflows/components/workflow-overview.tsx"
  "features/demo-admin-workflows/components/workflow-overview.module.css"
  "features/demo-admin-workflows/components/workflow-builder.tsx"
  "features/demo-admin-workflows/components/workflow-builder.module.css"
  "features/demo-admin-workflows/fixtures/workflow-demo-data.ts"
  "app/demo/admin/workflows/page.tsx"
  "app/demo/admin/workflows/builder/page.tsx"
)

for file in "${required[@]}"; do
  [[ -f "$file" ]] || {
    echo "FAIL: Missing $file" >&2
    exit 1
  }
done

grep -Fq "DemoRoleNavigationBridge" app/demo/layout.tsx
grep -Fq 'officer: "/demo/officer"' components/demo/role-switch/demo-role-navigation-bridge.tsx
grep -Fq 'supervisor: "/demo/supervisor"' components/demo/role-switch/demo-role-navigation-bridge.tsx
grep -Fq 'admin: "/demo/admin"' components/demo/role-switch/demo-role-navigation-bridge.tsx
grep -Fq "onDragStart" features/demo-admin-workflows/components/workflow-builder.tsx
grep -Fq "onDrop" features/demo-admin-workflows/components/workflow-builder.tsx
grep -Fq "Workflow templates" features/demo-admin-workflows/components/workflow-overview.tsx

echo "PASS: Role routes, workflow overview and drag-drop builder are installed."
