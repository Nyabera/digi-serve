"use client";

import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  useEffect,
} from "react";

import {
  DEMO_NAVIGATION_EVENT,
  DEMO_PATH_STORAGE_KEY,
  DEMO_ROLE_HOME_ROUTES,
  DEMO_ROLE_STORAGE_KEY,
  demoRoleRouteStorageKey,
  resolveDemoRoleFromPath,
  type DemoNavigationState,
  type DemoWorkspaceRole,
} from "@/features/demo-engine/navigation";

const ROLE_NAMES: Readonly<
  Record<string, DemoWorkspaceRole>
> = {
  applicant: "applicant",
  officer: "officer",
  supervisor: "supervisor",
  admin: "admin",
};

function normalize(
  value: string | null | undefined,
): string {
  return (
    value
      ?.replace(/\s+/g, " ")
      .trim()
      .toLowerCase() ?? ""
  );
}

function readRole(
  value: string | null | undefined,
): DemoWorkspaceRole | null {
  return ROLE_NAMES[normalize(value)] ?? null;
}

function isViewAsSelect(
  select: HTMLSelectElement,
): boolean {
  const roles = Array.from(select.options)
    .map((option) => readRole(option.textContent))
    .filter(
      (role): role is DemoWorkspaceRole =>
        role !== null,
    );

  if (new Set(roles).size >= 3) {
    return true;
  }

  let current: HTMLElement | null = select;

  for (
    let depth = 0;
    current && depth < 5;
    depth += 1
  ) {
    if (
      normalize(current.textContent).includes("view as")
    ) {
      return true;
    }

    current = current.parentElement;
  }

  return false;
}

function synchronizeNativeRoleSelectors(
  role: DemoWorkspaceRole,
): void {
  document
    .querySelectorAll<HTMLSelectElement>("select")
    .forEach((select) => {
      if (!isViewAsSelect(select)) {
        return;
      }

      const optionIndex = Array.from(
        select.options,
      ).findIndex(
        (option) =>
          readRole(option.textContent) === role ||
          readRole(option.value) === role,
      );

      if (
        optionIndex >= 0 &&
        select.selectedIndex !== optionIndex
      ) {
        select.selectedIndex = optionIndex;
      }
    });
}

function publishNavigationState(
  state: DemoNavigationState,
): void {
  window.dispatchEvent(
    new CustomEvent<DemoNavigationState>(
      DEMO_NAVIGATION_EVENT,
      {
        detail: state,
      },
    ),
  );
}

export function DemoRoleNavigationBridge() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const role = resolveDemoRoleFromPath(pathname);

    window.sessionStorage.setItem(
      DEMO_PATH_STORAGE_KEY,
      pathname,
    );

    document.documentElement.dataset.demoRole =
      role ?? "public";

    if (role) {
      window.sessionStorage.setItem(
        DEMO_ROLE_STORAGE_KEY,
        role,
      );
      window.sessionStorage.setItem(
        demoRoleRouteStorageKey(role),
        pathname,
      );
      synchronizeNativeRoleSelectors(role);
    }

    publishNavigationState({
      role,
      pathname,
    });
  }, [pathname]);

  useEffect(() => {
    let selectorIsArmed = false;
    let selectorTimer: number | undefined;

    const navigate = (role: DemoWorkspaceRole) => {
      selectorIsArmed = false;

      if (selectorTimer !== undefined) {
        window.clearTimeout(selectorTimer);
      }

      window.sessionStorage.setItem(
        DEMO_ROLE_STORAGE_KEY,
        role,
      );

      const destination =
        DEMO_ROLE_HOME_ROUTES[role];

      publishNavigationState({
        role,
        pathname: destination,
      });

      router.push(destination);
    };

    const armCustomSelector = () => {
      selectorIsArmed = true;

      if (selectorTimer !== undefined) {
        window.clearTimeout(selectorTimer);
      }

      selectorTimer = window.setTimeout(() => {
        selectorIsArmed = false;
      }, 6000);
    };

    const handleChange = (event: Event) => {
      const select = event.target;

      if (
        !(select instanceof HTMLSelectElement) ||
        !isViewAsSelect(select)
      ) {
        return;
      }

      const selected =
        select.options[select.selectedIndex];
      const role =
        readRole(selected?.textContent) ??
        readRole(select.value);

      if (role) {
        navigate(role);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest(
              [
                "button",
                "a",
                "li",
                '[role="option"]',
                '[role="menuitem"]',
                '[role="combobox"]',
              ].join(", "),
            )
          : null;

      if (!target) {
        return;
      }

      const text = normalize(target.textContent);

      if (text.includes("view as")) {
        armCustomSelector();
        return;
      }

      const role = readRole(target.textContent);

      if (!role || !selectorIsArmed) {
        return;
      }

      const insideOptionSurface = Boolean(
        target.closest(
          [
            '[role="listbox"]',
            '[role="menu"]',
            "[data-radix-select-viewport]",
          ].join(", "),
        ),
      );

      if (!insideOptionSurface) {
        return;
      }

      event.preventDefault();
      navigate(role);
    };

    document.addEventListener(
      "change",
      handleChange,
      true,
    );
    document.addEventListener(
      "click",
      handleClick,
      true,
    );

    return () => {
      document.removeEventListener(
        "change",
        handleChange,
        true,
      );
      document.removeEventListener(
        "click",
        handleClick,
        true,
      );

      if (selectorTimer !== undefined) {
        window.clearTimeout(selectorTimer);
      }
    };
  }, [router]);

  return null;
}
