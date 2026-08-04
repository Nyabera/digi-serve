"use client";

import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileSearch,
  Filter,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import {
  type DemoDocumentReviewStatus,
  type DemoIssuedDocumentStatus,
  type DemoVerificationLogResult,
  useDemoDocuments,
} from "@/features/demo-engine/config";

import {
  formatHubDate,
  formatHubTimestamp,
  hubMetrics,
  issuedLabel,
  reviewLabel,
  verificationLabel,
} from "../lib/document-hub-view-models";

import styles from "./officer-document-hub.module.css";

export type OfficerDocumentHubTab =
  | "issued"
  | "review"
  | "verifications";

const tabs: Array<{
  readonly id: OfficerDocumentHubTab;
  readonly label: string;
}> = [
  { id: "issued", label: "Issued Documents" },
  { id: "review", label: "Document Review" },
  { id: "verifications", label: "Verifications" },
];

export function OfficerDocumentHub({
  initialTab = "issued",
}: {
  readonly initialTab?: OfficerDocumentHubTab;
}) {
  const documents = useDemoDocuments();
  const metrics = useMemo(
    () => hubMetrics(documents),
    [documents],
  );
  const [activeTab, setActiveTab] =
    useState<OfficerDocumentHubTab>(initialTab);

  return (
    <section className={styles.workspace}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>
          Officer operations
        </p>
        <h1>Documents &amp; Verification Hub</h1>
        <p>
          Manage issued documents, review queues and
          verification activity in one workspace.
        </p>
      </header>

      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Document hub sections"
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

      <div className={styles.panel}>
        {activeTab === "issued" ? (
          <IssuedTab metrics={metrics} />
        ) : null}
        {activeTab === "review" ? (
          <ReviewTab metrics={metrics} />
        ) : null}
        {activeTab === "verifications" ? (
          <VerificationTab metrics={metrics} />
        ) : null}
      </div>
    </section>
  );
}

function Toolbar({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className={styles.toolbar}>
      {children}
    </div>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder: string;
}) {
  return (
    <label className={styles.searchBox}>
      <Search
        aria-hidden="true"
        size={18}
      />
      <span className={styles.srOnly}>
        Search
      </span>
      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
      />
    </label>
  );
}

function Metric({
  label,
  value,
  tone,
  icon: Icon,
}: {
  readonly label: string;
  readonly value: string;
  readonly tone: string;
  readonly icon: LucideIcon;
}) {
  return (
    <article
      className={styles.metric}
      data-tone={tone}
    >
      <div>
        <span>{label}</span>
        <Icon
          aria-hidden="true"
          size={22}
        />
      </div>
      <strong>{value}</strong>
      <p>Demo operational metric</p>
    </article>
  );
}

function Badge({
  tone,
  children,
}: {
  readonly tone: string;
  readonly children: React.ReactNode;
}) {
  return (
    <span
      className={styles.badge}
      data-tone={tone}
    >
      {children}
    </span>
  );
}

function IssuedTab({
  metrics,
}: {
  readonly metrics: ReturnType<
    typeof hubMetrics
  >;
}) {
  const documents =
    useDemoDocuments().issuedDocuments;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<
    DemoIssuedDocumentStatus | "all"
  >("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return documents.filter((item) => {
      const matchesQuery =
        !q ||
        [
          item.id,
          item.requestId,
          item.applicantName,
          item.documentType,
        ].some((value) =>
          value.toLowerCase().includes(q),
        );

      return (
        matchesQuery &&
        (
          status === "all" ||
          item.status === status
        )
      );
    });
  }, [documents, query, status]);

  return (
    <>
      <Toolbar>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search issued documents..."
        />
        <select
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as
                | DemoIssuedDocumentStatus
                | "all",
            )
          }
        >
          <option value="all">
            All Statuses
          </option>
          <option value="valid">Valid</option>
          <option value="revoked">
            Revoked
          </option>
          <option value="expired">
            Expired
          </option>
          <option value="replaced">
            Replaced
          </option>
        </select>
        <button type="button">
          <Filter size={18} />
          Filters
        </button>
        <button type="button">
          <Download size={18} />
          Export
        </button>
      </Toolbar>

      <div className={styles.metrics}>
        <Metric
          label="Issued This Week"
          value={String(metrics.issued)}
          tone="blue"
          icon={FileCheck2}
        />
        <Metric
          label="Verified"
          value={String(metrics.successful)}
          tone="green"
          icon={ShieldCheck}
        />
        <Metric
          label="Revoked"
          value={String(metrics.revoked)}
          tone="red"
          icon={XCircle}
        />
        <Metric
          label="Document Views"
          value={String(
            documents.reduce(
              (sum, item) => sum + item.views,
              0,
            ),
          )}
          tone="purple"
          icon={Eye}
        />
      </div>

      <DocumentTable
        items={filtered}
      />
    </>
  );
}

function DocumentTable({
  items,
}: {
  readonly items: ReturnType<
    typeof useDemoDocuments
  >["issuedDocuments"];
}) {
  return (
    <div className={styles.tableCard}>
      <div className={styles.tableTitle}>
        <div>
          <h2>Issued documents</h2>
          <p>
            Controlled records issued from
            completed workflows.
          </p>
        </div>
        <span>{items.length} records</span>
      </div>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Document ID</th>
              <th>Request ID</th>
              <th>Applicant</th>
              <th>Document Type</th>
              <th>Issued On</th>
              <th>Expires On</th>
              <th>Views</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className={styles.link}>
                  {item.id}
                </td>
                <td>{item.requestId}</td>
                <td>{item.applicantName}</td>
                <td>{item.documentType}</td>
                <td>
                  {formatHubDate(item.issuedAt)}
                </td>
                <td>
                  {item.expiresAt
                    ? formatHubDate(
                        item.expiresAt,
                      )
                    : "—"}
                </td>
                <td>{item.views}</td>
                <td>
                  <Badge tone={item.status}>
                    {issuedLabel(item.status)}
                  </Badge>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      aria-label={`View ${item.id}`}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Download ${item.id}`}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewTab({
  metrics,
}: {
  readonly metrics: ReturnType<
    typeof hubMetrics
  >;
}) {
  const reviews =
    useDemoDocuments().reviewQueue;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<
    DemoDocumentReviewStatus | "all"
  >("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return reviews.filter((item) => {
      const matchesQuery =
        !q ||
        [
          item.id,
          item.requestId,
          item.applicantName,
          item.documentType,
        ].some((value) =>
          value.toLowerCase().includes(q),
        );

      return (
        matchesQuery &&
        (
          status === "all" ||
          item.status === status
        )
      );
    });
  }, [query, reviews, status]);

  return (
    <>
      <Toolbar>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search review queue..."
        />
        <select
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as
                | DemoDocumentReviewStatus
                | "all",
            )
          }
        >
          <option value="all">
            All Statuses
          </option>
          <option value="pending">
            Pending
          </option>
          <option value="in-review">
            In Review
          </option>
          <option value="approved">
            Approved
          </option>
          <option value="rejected">
            Rejected
          </option>
        </select>
        <button type="button">
          <Filter size={18} />
          Filters
        </button>
      </Toolbar>

      <div className={styles.metrics}>
        <Metric
          label="Pending Review"
          value={String(
            metrics.pendingReviews,
          )}
          tone="orange"
          icon={Clock3}
        />
        <Metric
          label="In Review"
          value={String(metrics.inReview)}
          tone="blue"
          icon={FileSearch}
        />
        <Metric
          label="Reviewed Today"
          value={String(
            reviews.filter(
              (item) =>
                item.status === "approved",
            ).length,
          )}
          tone="green"
          icon={CheckCircle2}
        />
        <Metric
          label="Rejected Today"
          value={String(
            reviews.filter(
              (item) =>
                item.status === "rejected",
            ).length,
          )}
          tone="red"
          icon={XCircle}
        />
      </div>

      <div className={styles.cards}>
        {filtered.map((item) => (
          <article
            key={item.id}
            className={styles.reviewCard}
          >
            <Badge tone={item.status}>
              {reviewLabel(item.status)}
            </Badge>
            <p className={styles.requestId}>
              {item.requestId}
            </p>
            <h2>{item.applicantName}</h2>
            <p>{item.documentType}</p>
            <dl>
              <div>
                <dt>Category</dt>
                <dd>{item.category}</dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd>
                  {formatHubTimestamp(
                    item.submittedAt,
                  )}
                </dd>
              </div>
              <div>
                <dt>Assigned to</dt>
                <dd>{item.reviewerName}</dd>
              </div>
              <div>
                <dt>Due</dt>
                <dd>
                  {formatHubTimestamp(
                    item.dueAt,
                  )}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              className={styles.reviewAction}
            >
              {item.status === "in-review"
                ? "Continue Review"
                : "View & Review"}
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

function VerificationTab({
  metrics,
}: {
  readonly metrics: ReturnType<
    typeof hubMetrics
  >;
}) {
  const logs =
    useDemoDocuments().verificationLogs;
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<
    DemoVerificationLogResult | "all"
  >("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return logs.filter((item) => {
      const matchesQuery =
        !q ||
        [
          item.id,
          item.documentId,
          item.applicantName,
          item.documentType,
        ].some((value) =>
          value.toLowerCase().includes(q),
        );

      return (
        matchesQuery &&
        (
          result === "all" ||
          item.result === result
        )
      );
    });
  }, [logs, query, result]);

  return (
    <>
      <Toolbar>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search verifications..."
        />
        <select
          value={result}
          onChange={(event) =>
            setResult(
              event.target.value as
                | DemoVerificationLogResult
                | "all",
            )
          }
        >
          <option value="all">
            All Results
          </option>
          <option value="successful">
            Successful
          </option>
          <option value="failed">
            Failed
          </option>
          <option value="pending">
            Pending
          </option>
        </select>
        <button type="button">
          <CalendarDays size={18} />
          23 Jul - 29 Jul
        </button>
        <button type="button">
          <Download size={18} />
          Export
        </button>
      </Toolbar>

      <div className={styles.metrics}>
        <Metric
          label="Total Verifications"
          value={String(logs.length)}
          tone="blue"
          icon={FileCheck2}
        />
        <Metric
          label="Successful"
          value={String(metrics.successful)}
          tone="green"
          icon={CheckCircle2}
        />
        <Metric
          label="Failed"
          value={String(metrics.failed)}
          tone="red"
          icon={XCircle}
        />
        <Metric
          label="Pending"
          value={String(
            metrics.pendingVerification,
          )}
          tone="orange"
          icon={Clock3}
        />
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableTitle}>
          <div>
            <h2>Recent verifications</h2>
            <p>
              Public-portal and Officer-portal
              activity.
            </p>
          </div>
          <span>{filtered.length} results</span>
        </div>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Verification ID</th>
                <th>Document ID</th>
                <th>Applicant</th>
                <th>Document Type</th>
                <th>Verified On</th>
                <th>Result</th>
                <th>Verified By</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className={styles.link}>
                    {item.id}
                  </td>
                  <td>{item.documentId}</td>
                  <td>{item.applicantName}</td>
                  <td>{item.documentType}</td>
                  <td>
                    {formatHubTimestamp(
                      item.verifiedAt,
                    )}
                  </td>
                  <td>
                    <Badge tone={item.result}>
                      {verificationLabel(
                        item.result,
                      )}
                    </Badge>
                  </td>
                  <td>{item.verifiedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
