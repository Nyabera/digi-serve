"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

export type DemoWorkspaceRole =
  | "APPLICANT"
  | "OFFICER"
  | "SUPERVISOR"
  | "ADMIN";

export const DEMO_WORKSPACE_ROLE_STORAGE_KEY =
  "faidia.demo-engine.role.v1";

const ROLE_CHANGE_EVENT =
  "faidia:demo-workspace-role-change";

const ROLE_HOME: Record<DemoWorkspaceRole, string> = {
  APPLICANT: "/demo/track/REQ-DEMO-001",
  OFFICER: "/demo/officer",
  SUPERVISOR: "/demo/supervisor",
  ADMIN: "/demo/reports?scope=institution",
};

type RoleContextValue = {
  readonly role: DemoWorkspaceRole;
  readonly isHydrated: boolean;
  readonly switchRole: (role: DemoWorkspaceRole) => void;
};

const RoleContext =
  createContext<RoleContextValue | null>(null);

function isRole(
  value: string | null,
): value is DemoWorkspaceRole {
  return (
    value === "APPLICANT" ||
    value === "OFFICER" ||
    value === "SUPERVISOR" ||
    value === "ADMIN"
  );
}

function fallbackRole(
  pathname: string,
): DemoWorkspaceRole {
  if (pathname.startsWith("/demo/supervisor")) {
    return "SUPERVISOR";
  }

  if (
    pathname.startsWith("/demo/officer") ||
    pathname.startsWith("/demo/department")
  ) {
    return "OFFICER";
  }

  if (pathname === "/demo/reports") {
    return "SUPERVISOR";
  }

  return "APPLICANT";
}

function roleFromLocation(
  pathname: string,
): DemoWorkspaceRole | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (pathname === "/demo/reports") {
    const search = new URLSearchParams(
      window.location.search,
    );

    return search.get("scope") === "institution"
      ? "ADMIN"
      : "SUPERVISOR";
  }

  if (pathname.startsWith("/demo/officer")) {
    return "OFFICER";
  }

  if (pathname.startsWith("/demo/supervisor")) {
    return "SUPERVISOR";
  }

  if (
    pathname === "/demo" ||
    pathname.startsWith("/demo/track/")
  ) {
    return "APPLICANT";
  }

  return null;
}

function getStoredRoleSnapshot():
  | DemoWorkspaceRole
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedRole = window.sessionStorage.getItem(
    DEMO_WORKSPACE_ROLE_STORAGE_KEY,
  );

  return isRole(storedRole) ? storedRole : null;
}

function subscribeToStoredRole(
  onStoreChange: () => void,
) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (
      event.key ===
      DEMO_WORKSPACE_ROLE_STORAGE_KEY
    ) {
      onStoreChange();
    }
  };

  window.addEventListener(
    "storage",
    handleStorage,
  );
  window.addEventListener(
    ROLE_CHANGE_EVENT,
    onStoreChange,
  );

  return () => {
    window.removeEventListener(
      "storage",
      handleStorage,
    );
    window.removeEventListener(
      ROLE_CHANGE_EVENT,
      onStoreChange,
    );
  };
}

const subscribeToHydration = () => () => undefined;

export function getDemoRoleHome(
  role: DemoWorkspaceRole,
) {
  return ROLE_HOME[role];
}

export function DemoWorkspaceRoleProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  const storedRole = useSyncExternalStore(
    subscribeToStoredRole,
    getStoredRoleSnapshot,
    () => null,
  );

  const routeRole = isHydrated
    ? roleFromLocation(pathname)
    : null;

  const role =
    routeRole ??
    storedRole ??
    fallbackRole(pathname);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (getStoredRoleSnapshot() !== role) {
      window.sessionStorage.setItem(
        DEMO_WORKSPACE_ROLE_STORAGE_KEY,
        role,
      );
    }
  }, [isHydrated, role]);

  const switchRole = useCallback(
    (nextRole: DemoWorkspaceRole) => {
      window.sessionStorage.setItem(
        DEMO_WORKSPACE_ROLE_STORAGE_KEY,
        nextRole,
      );

      window.dispatchEvent(
        new Event(ROLE_CHANGE_EVENT),
      );

      router.push(ROLE_HOME[nextRole]);
    },
    [router],
  );

  const value = useMemo(
    () => ({
      role,
      isHydrated,
      switchRole,
    }),
    [isHydrated, role, switchRole],
  );

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useDemoWorkspaceRole() {
  const value = useContext(RoleContext);

  if (!value) {
    throw new Error(
      "useDemoWorkspaceRole must be used inside DemoWorkspaceRoleProvider.",
    );
  }

  return value;
}
