"use client";

import type { DemoRole } from "@/types/demo/client-config";
import { useDemoState } from "@/features/demo/state";

const roles: readonly {
  readonly value: DemoRole;
  readonly label: string;
}[] = [
  {
    value: "APPLICANT",
    label: "Applicant",
  },
  {
    value: "OFFICER",
    label: "Officer",
  },
  {
    value: "SUPERVISOR",
    label: "Supervisor",
  },
  {
    value: "ORGANIZATION_ADMIN",
    label: "Admin",
  },
];

export function RoleSwitcher() {
  const { state, dispatch, isHydrated } = useDemoState();

  function selectRole(role: DemoRole) {
    dispatch({
      type: "SET_ACTIVE_ROLE",
      role,
      at: new Date().toISOString(),
    });
  }

  return (
    <label className="flex min-w-max items-center gap-2">
      <span className="text-xs font-semibold text-slate-500">
        View as
      </span>

      <select
        value={state.activeRole}
        disabled={!isHydrated}
        onChange={(event) =>
          selectRole(event.target.value as DemoRole)
        }
        className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 outline-none transition hover:border-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
    </label>
  );
}
