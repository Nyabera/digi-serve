"use client";

import {
  useState,
  type ReactNode,
} from "react";

import { DemoWorkspaceSwitcher } from "@/components/demo/role-switcher";

import { InternalSidebar } from "./internal-sidebar";
import { InternalTopbar } from "./internal-topbar";
import type { InternalShellRole } from "./internal-navigation";
import styles from "./internal-shell.module.css";

type InternalAppShellProps = {
  readonly role: InternalShellRole;
  readonly institutionName: string;
  readonly institutionSubtitle?: string;
  readonly institutionInitials?: string;
  readonly staffName: string;
  readonly staffRoleLabel: string;
  readonly staffAvatarUrl?: string;
  readonly requestSelector?: ReactNode;
  readonly roleSelector?: ReactNode;
  readonly presentationAction?: ReactNode;
  readonly resetAction?: ReactNode;
  readonly children: ReactNode;
};

export function InternalAppShell(
  props: InternalAppShellProps,
) {
  const {
    role,
    institutionName,
    institutionSubtitle = "Student Services",
    institutionInitials,
    staffName,
    staffRoleLabel,
    staffAvatarUrl,
    requestSelector,
    presentationAction,
    resetAction,
    children,
  } = props;

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  return (
    <div
      className={`${styles.shell} ${
        sidebarCollapsed
          ? styles.shellCollapsed
          : ""
      }`}
      data-internal-shell-role={role}
    >
      <InternalSidebar
        role={role}
        institutionName={institutionName}
        institutionSubtitle={institutionSubtitle}
        institutionInitials={institutionInitials}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCollapseToggle={() =>
          setSidebarCollapsed((current) => !current)
        }
        onMobileClose={() =>
          setMobileSidebarOpen(false)
        }
      />

      <div className={styles.workspace}>
        <InternalTopbar
          staffName={staffName}
          staffRoleLabel={staffRoleLabel}
          staffAvatarUrl={staffAvatarUrl}
          requestSelector={requestSelector}
          roleSelector={<DemoWorkspaceSwitcher />}
          presentationAction={presentationAction}
          resetAction={resetAction}
          onMobileMenuOpen={() =>
            setMobileSidebarOpen(true)
          }
        />

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
