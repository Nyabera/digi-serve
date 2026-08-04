"use client";

import {
  Bell,
  CircleHelp,
  ClipboardList,
  FolderOpen,
  Home,
  LogOut,
  Menu,
  Search,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type {
  ReactNode,
} from "react";
import {
  useState,
} from "react";

import {
  useDemoApplicantProfile,
  useDemoPack,
} from "@/features/demo-engine/config";

import {
  createApplicantInitials,
} from "../lib/applicant-profile-view-models";

import styles from "./applicant-workspace-shell.module.css";

const navigation = [
  {
    label: "Dashboard",
    href: "/demo/track",
    icon: Home,
  },
  {
    label: "My Requests",
    href: "/demo/track",
    icon: ClipboardList,
  },
  {
    label: "My Documents",
    href: "/demo/applicant/documents",
    icon: FolderOpen,
  },
  {
    label: "My Profile",
    href: "/demo/applicant/profile",
    icon: UserRound,
  },
] as const;

export function ApplicantWorkspaceShell({
  children,
}: {
  readonly children: ReactNode;
}) {
  const pathname = usePathname();
  const pack = useDemoPack();
  const profile = useDemoApplicantProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = createApplicantInitials(
    profile.fullName,
  );

  return (
    <div className={styles.shell}>
      <aside
        className={styles.sidebar}
        data-open={mobileOpen}
      >
        <div className={styles.brand}>
          <span className={styles.brandMark}>
            {pack.organization.initials}
          </span>
          <span>
            <strong>{pack.organization.shortName}</strong>
            <small>Applicant Services</small>
          </span>
        </div>

        <nav
          className={styles.navigation}
          aria-label="Applicant navigation"
        >
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/demo/track"
                ? pathname === "/demo/track"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <Icon
                  aria-hidden="true"
                  size={19}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/demo#help">
            <CircleHelp
              aria-hidden="true"
              size={19}
            />
            <span>Help &amp; Support</span>
          </Link>
          <Link href="/demo">
            <LogOut
              aria-hidden="true"
              size={19}
            />
            <span>Exit Demo</span>
          </Link>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="Toggle applicant navigation"
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen((current) => !current)
            }
          >
            <Menu
              aria-hidden="true"
              size={21}
            />
          </button>

          <label className={styles.search}>
            <Search
              aria-hidden="true"
              size={18}
            />
            <span className={styles.srOnly}>
              Search applicant workspace
            </span>
            <input
              placeholder="Search requests and services..."
            />
          </label>

          <div className={styles.topbarActions}>
            <button
              type="button"
              className={styles.notificationButton}
              aria-label="Notifications"
            >
              <Bell
                aria-hidden="true"
                size={20}
              />
              <span>2</span>
            </button>

            <Link
              href="/demo/applicant/profile"
              className={styles.profileLink}
            >
              <span className={styles.avatar}>
                {initials}
              </span>
              <span>
                <strong>{profile.fullName}</strong>
                <small>
                  {profile.roleLabel} ·{" "}
                  {profile.studentNumber}
                </small>
              </span>
            </Link>
          </div>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
