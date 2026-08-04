"use client";

import Link from "next/link";
import { PanelLeftClose, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { OFFICER_ROUTE_HREFS } from "../../../features/demo-engine/navigation/officer-navigation-contract";

import {
  getInternalNavigation,
  isInternalNavigationItemActive,
  type InternalShellRole,
} from "./internal-navigation";
import styles from "./internal-shell.module.css";

type InternalSidebarProps = {
  readonly role: InternalShellRole;
  readonly institutionName: string;
  readonly institutionSubtitle: string;
  readonly institutionInitials?: string;
  readonly collapsed: boolean;
  readonly mobileOpen: boolean;
  readonly onCollapseToggle: () => void;
  readonly onMobileClose: () => void;
};

function initials(
  institutionName: string,
): string {
  return institutionName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getInternalSidebarBrandHref(
  role: InternalShellRole,
): string {
  return role === "OFFICER"
    ? OFFICER_ROUTE_HREFS.home
    : "/demo";
}

export function InternalSidebar({
  role,
  institutionName,
  institutionSubtitle,
  institutionInitials,
  collapsed,
  mobileOpen,
  onCollapseToggle,
  onMobileClose,
}: InternalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navigation = getInternalNavigation(role);

  function handleDemoLogout() {
    onMobileClose();
    router.push("/demo");
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        aria-hidden={!mobileOpen}
        disabled={!mobileOpen}
        tabIndex={mobileOpen ? 0 : -1}
        onClick={onMobileClose}
        className={`${styles.drawerBackdrop} ${
          mobileOpen
            ? styles.drawerBackdropOpen
            : ""
        }`}
      />

      <aside
        className={`${styles.sidebar} ${
          collapsed ? styles.sidebarCollapsed : ""
        } ${
          mobileOpen ? styles.sidebarMobileOpen : ""
        }`}
        aria-label="Internal workspace navigation"
      >
        <div className={styles.brandRow}>
          <Link
            href={getInternalSidebarBrandHref(role)}
            className={styles.brand}
            onClick={onMobileClose}
          >
            <span className={styles.brandMark}>
              {institutionInitials ??
                initials(institutionName)}
            </span>

            <span className={styles.brandText}>
              <strong>{institutionName}</strong>
              <span>{institutionSubtitle}</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onMobileClose}
            className={`${styles.sidebarButton} ${styles.mobileClose}`}
            aria-label="Close navigation"
          >
            <X
              aria-hidden="true"
              className="h-4 w-4"
            />
          </button>

          <button
            type="button"
            onClick={onCollapseToggle}
            className={`${styles.sidebarButton} ${styles.desktopCollapse}`}
            aria-label={
              collapsed
                ? "Expand navigation"
                : "Collapse navigation"
            }
          >
            <PanelLeftClose
              aria-hidden="true"
              className="h-4 w-4"
            />
          </button>
        </div>

        <nav
          className={styles.navigation}
          aria-label={`${role.toLowerCase()} navigation`}
        >
          {navigation.map((group) => (
            <section
              key={group.label}
              className={styles.navigationGroup}
            >
              <h2 className={styles.navigationLabel}>
                {group.label}
              </h2>

              <div className="nav-list">
                {group.items.map((item) => {
                  const active =
                    isInternalNavigationItemActive({
                      pathname,
                      item,
                    });
                  const Icon = item.icon;

                  if (item.kind === "action") {
                    return (
                      <button
                        key={`${group.label}-${item.label}`}
                        type="button"
                        title={
                          collapsed
                            ? item.label
                            : undefined
                        }
                        onClick={handleDemoLogout}
                        className="nav-item"
                      >
                        <Icon
                          aria-hidden="true"
                          className="nav-item-icon"
                        />

                        <span className="nav-item-label">
                          {item.label}
                        </span>
                      </button>
                    );
                  }

                  if (!item.href) {
                    return null;
                  }

                  return (
                    <Link
                      key={`${group.label}-${item.label}`}
                      href={item.href}
                      aria-current={
                        active ? "page" : undefined
                      }
                      title={
                        collapsed
                          ? item.label
                          : undefined
                      }
                      onClick={onMobileClose}
                      className="nav-item"
                    >
                      <Icon
                        aria-hidden="true"
                        className="nav-item-icon"
                      />

                      <span className="nav-item-label">
                        {item.label}
                      </span>

                      {item.badge ? (
                        <span className="nav-item-count">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.helpCard}>
            <span className={styles.helpIcon}>?</span>
            <div className={styles.helpCopy}>
              <strong>Need help?</strong>
              <span>
                Review the guided demo journey.
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
