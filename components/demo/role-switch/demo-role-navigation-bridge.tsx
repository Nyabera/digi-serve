"use client";

import { useEffect } from "react";

type DemoRole = "applicant" | "officer" | "supervisor" | "admin";

const ROLE_ROUTES: Record<DemoRole, string> = {
  applicant: "/demo/track",
  officer: "/demo/officer",
  supervisor: "/demo/supervisor",
  admin: "/demo/admin",
};

const ROLE_NAMES: Record<string, DemoRole> = {
  applicant: "applicant",
  officer: "officer",
  supervisor: "supervisor",
  admin: "admin",
};

function normalize(value: string | null | undefined) {
  return value?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";
}

function readRole(value: string | null | undefined): DemoRole | null {
  return ROLE_NAMES[normalize(value)] ?? null;
}

function isViewAsSelect(select: HTMLSelectElement) {
  const roles = Array.from(select.options)
    .map((option) => readRole(option.textContent))
    .filter(Boolean);

  if (new Set(roles).size >= 3) {
    return true;
  }

  let current: HTMLElement | null = select;
  for (let depth = 0; current && depth < 5; depth += 1) {
    if (normalize(current.textContent).includes("view as")) {
      return true;
    }
    current = current.parentElement;
  }

  return false;
}

function navigate(role: DemoRole) {
  window.sessionStorage.setItem("faidia-demo-role", role);
  window.location.assign(ROLE_ROUTES[role]);
}

export function DemoRoleNavigationBridge() {
  useEffect(() => {
    let customSelectorArmedUntil = 0;

    const handleChange = (event: Event) => {
      const select = event.target;

      if (!(select instanceof HTMLSelectElement) || !isViewAsSelect(select)) {
        return;
      }

      const selected = select.options[select.selectedIndex];
      const role = readRole(selected?.textContent) ?? readRole(select.value);

      if (role) {
        navigate(role);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest(
              'button, a, li, [role="option"], [role="menuitem"], [role="combobox"]',
            )
          : null;

      if (!target) {
        return;
      }

      const text = normalize(target.textContent);

      if (text.includes("view as")) {
        customSelectorArmedUntil = Date.now() + 6000;
        return;
      }

      const role = readRole(target.textContent);
      if (!role) {
        return;
      }

      const insideOptionSurface = Boolean(
        target.closest(
          '[role="listbox"], [role="menu"], [data-radix-select-viewport]',
        ),
      );

      if (!insideOptionSurface || Date.now() > customSelectorArmedUntil) {
        return;
      }

      event.preventDefault();
      navigate(role);
    };

    document.addEventListener("change", handleChange, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("change", handleChange, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return null;
}
