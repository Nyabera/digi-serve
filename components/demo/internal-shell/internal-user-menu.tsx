"use client";

import { ChevronDown } from "lucide-react";

import styles from "./internal-shell.module.css";

type InternalUserMenuProps = {
  readonly name: string;
  readonly roleLabel: string;
  readonly avatarUrl?: string;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function InternalUserMenu({
  name,
  roleLabel,
  avatarUrl,
}: InternalUserMenuProps) {
  return (
    <button
      type="button"
      className={styles.userMenu}
      aria-label={`Open profile menu for ${name}`}
    >
      <span className={styles.avatar}>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className={styles.avatarImage}
          />
        ) : (
          initials(name)
        )}
      </span>

      <span className={styles.userIdentity}>
        <strong>{name}</strong>
        <span>{roleLabel}</span>
      </span>

      <ChevronDown
        aria-hidden="true"
        className={styles.userChevron}
      />
    </button>
  );
}
