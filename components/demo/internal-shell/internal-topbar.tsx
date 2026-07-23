"use client";

import {
  Bell,
  Menu,
} from "lucide-react";
import type { ReactNode } from "react";

import { InternalGlobalSearch } from "./internal-global-search";
import { InternalUserMenu } from "./internal-user-menu";
import styles from "./internal-shell.module.css";

type InternalTopbarProps = {
  readonly staffName: string;
  readonly staffRoleLabel: string;
  readonly staffAvatarUrl?: string;
  readonly requestSelector?: ReactNode;
  readonly roleSelector?: ReactNode;
  readonly presentationAction?: ReactNode;
  readonly resetAction?: ReactNode;
  readonly onMobileMenuOpen: () => void;
};

export function InternalTopbar({
  staffName,
  staffRoleLabel,
  staffAvatarUrl,
  requestSelector,
  roleSelector,
  presentationAction,
  resetAction,
  onMobileMenuOpen,
}: InternalTopbarProps) {
  return (
    <header className={styles.topbar}>
      <button
        type="button"
        onClick={onMobileMenuOpen}
        className={`${styles.topbarIconButton} ${styles.mobileMenuButton}`}
        aria-label="Open navigation"
      >
        <Menu
          aria-hidden="true"
          className="h-5 w-5"
        />
      </button>

      <div className={styles.topbarSearch}>
        <InternalGlobalSearch />
      </div>

      <div className={styles.topbarControls}>
        {requestSelector ? (
          <div className={styles.topbarSlot}>
            {requestSelector}
          </div>
        ) : null}

        {roleSelector ? (
          <div className={styles.topbarSlot}>
            {roleSelector}
          </div>
        ) : null}

        {presentationAction ? (
          <div className={styles.topbarSlot}>
            {presentationAction}
          </div>
        ) : null}

        {resetAction ? (
          <div className={styles.topbarSlot}>
            {resetAction}
          </div>
        ) : null}

        <button
          type="button"
          className={styles.notificationButton}
          aria-label="Open notifications"
        >
          <Bell
            aria-hidden="true"
            className="h-5 w-5"
          />
          <span
            className={styles.notificationCount}
            aria-label="5 unread notifications"
          >
            5
          </span>
        </button>

        <InternalUserMenu
          name={staffName}
          roleLabel={staffRoleLabel}
          avatarUrl={staffAvatarUrl}
        />
      </div>
    </header>
  );
}
