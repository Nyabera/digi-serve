"use client";

import type {
  LucideIcon,
} from "lucide-react";
import {
  BadgeCheck,
  CheckCircle2,
  GraduationCap,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
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
  formatApplicantProfileDate,
} from "../lib/applicant-profile-view-models";

import styles from "./applicant-profile-page.module.css";

type PreferenceKey =
  | "emailNotifications"
  | "smsNotifications"
  | "inAppNotifications"
  | "requestUpdates"
  | "paymentConfirmations"
  | "documentIssuedAlerts";

const preferenceLabels: Array<{
  readonly key: PreferenceKey;
  readonly label: string;
  readonly description: string;
}> = [
  {
    key: "emailNotifications",
    label: "Email notifications",
    description:
      "Receive important updates by email.",
  },
  {
    key: "smsNotifications",
    label: "SMS notifications",
    description:
      "Receive important updates by SMS.",
  },
  {
    key: "inAppNotifications",
    label: "In-app notifications",
    description:
      "Receive alerts inside the Demo.",
  },
  {
    key: "requestUpdates",
    label: "Request updates",
    description:
      "Receive progress updates on submitted requests.",
  },
  {
    key: "paymentConfirmations",
    label: "Payment confirmations",
    description:
      "Receive payment receipts and confirmations.",
  },
  {
    key: "documentIssuedAlerts",
    label: "Document-issued alerts",
    description:
      "Receive an alert when a document is issued.",
  },
];

export function ApplicantProfilePage() {
  const pack = useDemoPack();
  const profile = useDemoApplicantProfile();
  const [feedback, setFeedback] = useState("");
  const [preferences, setPreferences] = useState<
    Record<PreferenceKey, boolean>
  >({
    ...profile.communicationPreferences,
  });

  const initials = createApplicantInitials(
    profile.fullName,
  );

  const showDemoFeedback = (message: string) => {
    setFeedback(message);
  };

  const togglePreference = (key: PreferenceKey) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
    setFeedback(
      "Communication preference updated in the Demo.",
    );
  };

  return (
    <section className={styles.page}>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>
            Applicant account
          </p>
          <h1>User Profile</h1>
          <p>
            Review personal, academic, communication and
            security settings.
          </p>
        </div>

        <span
          className={styles.feedback}
          aria-live="polite"
        >
          {feedback}
        </span>
      </div>

      <div className={styles.layout}>
        <aside className={styles.profileColumn}>
          <article className={styles.summaryCard}>
            <div className={styles.avatarRow}>
              <div className={styles.largeAvatar}>
                {initials}
              </div>
              <div
                className={styles.completionRing}
                style={{
                  background:
                    `conic-gradient(#155eef ` +
                    `${profile.profileCompletion}%, ` +
                    `#e7edf7 0)`,
                }}
              >
                <span>
                  {profile.profileCompletion}%
                </span>
              </div>
            </div>

            <h2>{profile.fullName}</h2>
            <p className={styles.role}>
              {profile.roleLabel}
            </p>

            <dl className={styles.summaryList}>
              <div>
                <dt>Student number</dt>
                <dd>{profile.studentNumber}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{profile.email}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{profile.phone}</dd>
              </div>
            </dl>

            <button
              type="button"
              className={styles.outlineButton}
              onClick={() =>
                showDemoFeedback(
                  "Profile-picture editing is simulated in this Demo.",
                )
              }
            >
              Edit profile picture
            </button>
          </article>

          <article className={styles.sideCard}>
            <div className={styles.sideCardHeading}>
              <ShieldCheck
                aria-hidden="true"
                size={20}
              />
              <h2>Verification Status</h2>
            </div>

            <VerificationItem
              label="Email verified"
              date={
                profile.verification.emailVerifiedAt
              }
            />
            <VerificationItem
              label="Phone verified"
              date={
                profile.verification.phoneVerifiedAt
              }
            />
            <VerificationItem
              label="Student record matched"
              date={
                profile.verification
                  .studentRecordMatchedAt
              }
            />
          </article>

          <article className={styles.sideCard}>
            <div className={styles.sideCardHeading}>
              <UserRound
                aria-hidden="true"
                size={20}
              />
              <h2>Membership</h2>
            </div>

            <dl className={styles.membershipList}>
              <div>
                <dt>Role</dt>
                <dd>{profile.roleLabel}</dd>
              </div>
              <div>
                <dt>Institution</dt>
                <dd>{pack.organization.name}</dd>
              </div>
            </dl>
          </article>
        </aside>

        <div className={styles.detailsColumn}>
          <ProfileSection
            title="Personal Information"
            icon={UserRound}
            onEdit={() =>
              showDemoFeedback(
                "Personal-information editing is simulated.",
              )
            }
          >
            <InfoGrid>
              <Info label="Full name" value={profile.fullName} />
              <Info
                label="Date of birth"
                value={formatApplicantProfileDate(
                  profile.dateOfBirth,
                )}
              />
              <Info label="Gender" value={profile.gender} />
              <Info
                label="Nationality"
                value={profile.nationality}
              />
              <Info
                label="Preferred name"
                value={profile.preferredName}
              />
              <Info
                label="Marital status"
                value={profile.maritalStatus}
              />
            </InfoGrid>
          </ProfileSection>

          <ProfileSection
            title="Contact Information"
            icon={Phone}
            onEdit={() =>
              showDemoFeedback(
                "Contact-information editing is simulated.",
              )
            }
          >
            <InfoGrid>
              <Info
                label="Email address"
                value={profile.email}
              />
              <Info
                label="Phone number"
                value={profile.phone}
              />
              <Info
                label="Alternate phone"
                value={profile.alternatePhone ?? "Not provided"}
              />
              <Info
                label="Home address"
                value={profile.homeAddress}
                wide
              />
            </InfoGrid>
          </ProfileSection>

          <ProfileSection
            title="Institution Details"
            icon={GraduationCap}
            onEdit={() =>
              showDemoFeedback(
                "Institution-detail editing is controlled by the institution.",
              )
            }
          >
            <InfoGrid>
              <Info
                label="Course / Programme"
                value={profile.programme}
              />
              <Info
                label="Department"
                value={profile.department}
              />
              <Info
                label="Campus"
                value={profile.campus}
              />
              <Info
                label="Intake"
                value={profile.intake}
              />
              <Info
                label="Year of study"
                value={profile.yearOfStudy}
              />
              <Info
                label="Expected completion"
                value={formatApplicantProfileDate(
                  profile.expectedCompletion,
                )}
              />
            </InfoGrid>
          </ProfileSection>

          <ProfileSection
            title="Communication Preferences"
            icon={Mail}
            onEdit={() =>
              showDemoFeedback(
                "Use the switches below to update preferences.",
              )
            }
          >
            <div className={styles.preferenceGrid}>
              {preferenceLabels.map((preference) => (
                <label
                  key={preference.key}
                  className={styles.preference}
                >
                  <span>
                    <strong>{preference.label}</strong>
                    <small>
                      {preference.description}
                    </small>
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences[preference.key]}
                    onChange={() =>
                      togglePreference(preference.key)
                    }
                  />
                  <span
                    className={styles.switch}
                    aria-hidden="true"
                  />
                </label>
              ))}
            </div>
          </ProfileSection>

          <ProfileSection
            title="Security"
            icon={BadgeCheck}
          >
            <div className={styles.securityList}>
              <SecurityRow
                title="Change password"
                detail="Update your account password."
                status="Available"
                onClick={() =>
                  showDemoFeedback(
                    "Password changes are simulated in this Demo.",
                  )
                }
              />
              <SecurityRow
                title="Two-factor authentication"
                detail="Add an extra layer of account protection."
                status={
                  profile.security.twoFactorEnabled
                    ? "Enabled"
                    : "Disabled"
                }
                onClick={() =>
                  showDemoFeedback(
                    "Two-factor settings are simulated in this Demo.",
                  )
                }
              />
              <SecurityRow
                title="Active sessions"
                detail="Manage signed-in devices."
                status={
                  `${profile.security.activeSessions} active`
                }
                onClick={() =>
                  showDemoFeedback(
                    "Session management is simulated in this Demo.",
                  )
                }
              />
            </div>
          </ProfileSection>
        </div>
      </div>
    </section>
  );
}

function ProfileSection({
  title,
  icon: Icon,
  children,
  onEdit,
}: {
  readonly title: string;
  readonly icon: LucideIcon;
  readonly children: ReactNode;
  readonly onEdit?: () => void;
}) {
  return (
    <article className={styles.sectionCard}>
      <header className={styles.sectionHeading}>
        <div>
          <Icon
            aria-hidden="true"
            size={20}
          />
          <h2>{title}</h2>
        </div>

        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
          >
            Edit
          </button>
        ) : null}
      </header>

      <div className={styles.sectionBody}>
        {children}
      </div>
    </article>
  );
}

function InfoGrid({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <dl className={styles.infoGrid}>{children}</dl>
  );
}

function Info({
  label,
  value,
  wide = false,
}: {
  readonly label: string;
  readonly value: string;
  readonly wide?: boolean;
}) {
  return (
    <div data-wide={wide}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function VerificationItem({
  label,
  date,
}: {
  readonly label: string;
  readonly date: string;
}) {
  return (
    <div className={styles.verificationItem}>
      <CheckCircle2
        aria-hidden="true"
        size={21}
      />
      <span>
        <strong>{label}</strong>
        <small>
          {formatApplicantProfileDate(date)}
        </small>
      </span>
    </div>
  );
}

function SecurityRow({
  title,
  detail,
  status,
  onClick,
}: {
  readonly title: string;
  readonly detail: string;
  readonly status: string;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.securityRow}
      onClick={onClick}
    >
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <span>{status}</span>
    </button>
  );
}
