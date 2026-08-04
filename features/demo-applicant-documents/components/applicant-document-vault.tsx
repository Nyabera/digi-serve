"use client";

import {
  BadgeCheck,
  CalendarDays,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  FolderOpen,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import {
  type DemoApplicantDocumentConfig,
  type DemoApplicantDocumentStatus,
  useDemoApplicantDocumentVault,
} from "@/features/demo-engine/config";

import {
  displayVaultStatus,
  filterVaultDocuments,
  formatFileSize,
  formatVaultDate,
} from "../lib/applicant-document-vault-view-models";

import styles from "./applicant-document-vault.module.css";

type VaultTab = "uploads" | "letters" | "certificates";

const tabs: readonly {
  readonly id: VaultTab;
  readonly label: string;
}[] = [
  { id: "uploads", label: "My Uploads" },
  { id: "letters", label: "Generated Letters" },
  { id: "certificates", label: "Certificates" },
];

export function ApplicantDocumentVault({
  initialTab = "uploads",
}: {
  readonly initialTab?: VaultTab;
}) {
  const vault = useDemoApplicantDocumentVault();
  const [activeTab, setActiveTab] =
    useState<VaultTab>(initialTab);
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");

  const documents = useMemo(
    () =>
      filterVaultDocuments(
        vault.documents,
        activeTab,
        query,
      ),
    [activeTab, query, vault.documents],
  );

  const uploads = vault.documents.filter(
    (document) => document.kind === "upload",
  );
  const letters = vault.documents.filter(
    (document) => document.kind === "generated-letter",
  );
  const certificates = vault.documents.filter(
    (document) => document.kind === "certificate",
  );
  const verifiedCount = vault.documents.filter(
    (document) =>
      document.status === "verified" ||
      document.status === "issued",
  ).length;
  const usagePercent = Math.min(
    100,
    Math.round(
      (vault.storageUsedBytes / vault.storageLimitBytes) *
        100,
    ),
  );

  const showDemoFeedback = (message: string) => {
    setFeedback(message);
  };

  return (
    <section className={styles.page}>
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>
            Applicant workspace
          </p>
          <h1>Documents</h1>
          <p>
            Manage uploads, generated letters and certificates
            in one secure document vault.
          </p>
        </div>

        <span
          className={styles.feedback}
          aria-live="polite"
        >
          {feedback}
        </span>
      </header>

      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Applicant document categories"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.metricGrid}>
        <Metric
          label="Total Uploads"
          value={String(uploads.length)}
          detail="+4 this month"
          icon={Upload}
          tone="blue"
        />
        <Metric
          label="Generated Letters"
          value={String(letters.length)}
          detail="+2 this month"
          icon={FileText}
          tone="purple"
        />
        <Metric
          label="Certificates"
          value={String(certificates.length)}
          detail="+1 this month"
          icon={BadgeCheck}
          tone="green"
        />
        <article className={styles.storageMetric}>
          <div>
            <span>Storage / Verification</span>
            <strong>
              {formatFileSize(vault.storageUsedBytes)}
            </strong>
            <small>
              {verifiedCount} of {vault.documents.length}{" "}
              verified or issued
            </small>
          </div>
          <div
            className={styles.storageRing}
            style={{
              background:
                `conic-gradient(#155eef ${usagePercent}%, ` +
                `#e8edf5 0)`,
            }}
          >
            <span>{usagePercent}%</span>
          </div>
        </article>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.documentPanel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>
                {tabs.find((tab) => tab.id === activeTab)
                  ?.label}
              </h2>
              <p>{documents.length} documents</p>
            </div>

            <div className={styles.panelActions}>
              <button
                type="button"
                onClick={() =>
                  showDemoFeedback(
                    "Bulk actions are simulated in this Demo.",
                  )
                }
              >
                <Filter
                  aria-hidden="true"
                  size={17}
                />
                Bulk Actions
              </button>
            </div>
          </div>

          <label className={styles.searchField}>
            <Search
              aria-hidden="true"
              size={18}
            />
            <span className={styles.srOnly}>
              Search documents
            </span>
            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search documents..."
            />
          </label>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Type</th>
                  <th>Created</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <DocumentRow
                    key={document.id}
                    document={document}
                    onAction={showDemoFeedback}
                  />
                ))}
              </tbody>
            </table>

            {documents.length === 0 ? (
              <div className={styles.emptyState}>
                <FolderOpen
                  aria-hidden="true"
                  size={30}
                />
                <h3>No matching documents</h3>
                <p>
                  Try another search or document category.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <aside className={styles.sideColumn}>
          <article className={styles.sideCard}>
            <h2>Quick Actions</h2>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={() =>
                showDemoFeedback(
                  "Upload is simulated; no file leaves your device.",
                )
              }
            >
              <Upload
                aria-hidden="true"
                size={18}
              />
              Upload New Document
            </button>
            <button
              type="button"
              onClick={() =>
                showDemoFeedback(
                  "Document filtering is simulated in this Demo.",
                )
              }
            >
              <Filter
                aria-hidden="true"
                size={18}
              />
              Filter Documents
            </button>
            <button
              type="button"
              onClick={() =>
                showDemoFeedback(
                  "Search is available above the table.",
                )
              }
            >
              <Search
                aria-hidden="true"
                size={18}
              />
              Search Documents
            </button>
          </article>

          <article className={styles.sideCard}>
            <h2>Vault Protection</h2>
            <div className={styles.protectionRow}>
              <ShieldCheck
                aria-hidden="true"
                size={22}
              />
              <span>
                <strong>Private document access</strong>
                <small>
                  Documents are represented as controlled,
                  applicant-owned records.
                </small>
              </span>
            </div>
            <div className={styles.protectionRow}>
              <FileCheck2
                aria-hidden="true"
                size={22}
              />
              <span>
                <strong>Verification-aware</strong>
                <small>
                  Issued certificates can link to the public
                  verification experience.
                </small>
              </span>
            </div>
          </article>

          <article className={styles.storageCard}>
            <div className={styles.storageCardHeading}>
              <div>
                <h2>Storage Usage</h2>
                <p>
                  {formatFileSize(vault.storageUsedBytes)} of{" "}
                  {formatFileSize(vault.storageLimitBytes)}
                </p>
              </div>
              <CalendarDays
                aria-hidden="true"
                size={22}
              />
            </div>
            <div
              className={styles.progressTrack}
              aria-label={`${usagePercent}% storage used`}
            >
              <span
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() =>
                showDemoFeedback(
                  "Storage management is simulated in this Demo.",
                )
              }
            >
              Manage Storage
            </button>
          </article>
        </aside>
      </div>
    </section>
  );
}

function DocumentRow({
  document,
  onAction,
}: {
  readonly document: DemoApplicantDocumentConfig;
  readonly onAction: (message: string) => void;
}) {
  return (
    <tr>
      <td>
        <div className={styles.fileIdentity}>
          <span className={styles.fileIcon}>
            <FileText
              aria-hidden="true"
              size={18}
            />
          </span>
          <span>
            <strong>{document.fileName}</strong>
            <small>{document.displayName}</small>
          </span>
        </div>
      </td>
      <td>{document.category}</td>
      <td>{formatVaultDate(document.createdAt)}</td>
      <td>{formatFileSize(document.sizeBytes)}</td>
      <td>
        <StatusBadge status={document.status} />
      </td>
      <td>
        <div className={styles.rowActions}>
          <button
            type="button"
            aria-label={`View ${document.fileName}`}
            onClick={() =>
              onAction(
                `Previewing ${document.fileName} is simulated.`,
              )
            }
          >
            <Eye
              aria-hidden="true"
              size={17}
            />
          </button>
          <button
            type="button"
            aria-label={`Download ${document.fileName}`}
            disabled={!document.downloadable}
            onClick={() =>
              onAction(
                `Download for ${document.fileName} is simulated.`,
              )
            }
          >
            <Download
              aria-hidden="true"
              size={17}
            />
          </button>
          <button
            type="button"
            aria-label={`More actions for ${document.fileName}`}
            onClick={() =>
              onAction(
                `Additional actions for ${document.fileName} are simulated.`,
              )
            }
          >
            <MoreHorizontal
              aria-hidden="true"
              size={17}
            />
          </button>
        </div>
      </td>
    </tr>
  );
}

function StatusBadge({
  status,
}: {
  readonly status: DemoApplicantDocumentStatus;
}) {
  return (
    <span
      className={styles.statusBadge}
      data-status={status}
    >
      {displayVaultStatus(status)}
    </span>
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly icon: typeof Upload;
  readonly tone: "blue" | "green" | "purple";
}) {
  return (
    <article
      className={styles.metricCard}
      data-tone={tone}
    >
      <span className={styles.metricIcon}>
        <Icon
          aria-hidden="true"
          size={22}
        />
      </span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}
