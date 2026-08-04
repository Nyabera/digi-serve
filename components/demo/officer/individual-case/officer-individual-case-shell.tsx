"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Copy,
  FileText,
  Mail,
  MoreHorizontal,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { InternalAppShell } from "@/components/demo/internal-shell";

import styles from "./officer-individual-case.module.css";

type OfficerIndividualCaseShellProps = {
  readonly requestId: string;
};

type ActivityItem = {
  readonly id: string;
  readonly label: string;
  readonly time: string;
  readonly current?: boolean;
};

const DOCUMENTS = [
  {
    id: "national-id",
    name: "National ID.pdf",
    result: "Verified",
  },
  {
    id: "graduation-clearance",
    name: "Graduation clearance.pdf",
    result: "Verified",
  },
  {
    id: "payment-receipt",
    name: "Payment receipt.pdf",
    result: "KES 1,500 · Verified",
  },
] as const;

type AcademicRecordRow = {
  readonly semester: string;
  readonly units: number;
  readonly result: string;
  readonly clearance: string;
  readonly warning?: boolean;
};

const ACADEMIC_RECORD: readonly AcademicRecordRow[] = [
  {
    semester: "Year 1 Sem 1",
    units: 8,
    result: "Complete",
    clearance: "Cleared",
  },
  {
    semester: "Year 1 Sem 2",
    units: 8,
    result: "Complete",
    clearance: "Cleared",
  },
  {
    semester: "Year 2 Sem 1",
    units: 7,
    result: "Complete",
    clearance: "Cleared",
  },
  {
    semester: "Year 2 Sem 2",
    units: 8,
    result: "1 discrepancy",
    clearance: "Cleared",
    warning: true,
  },
] as const;

const WORKFLOW_STAGES = [
  {
    label: "Received",
    date: "May 14, 2026",
  },
  {
    label: "Payment verified",
    date: "May 15, 2026",
  },
  {
    label: "Records review",
    date: "May 16, 2026",
  },
  {
    label: "Approval",
    date: "Pending",
  },
  {
    label: "Issued",
    date: "Pending",
  },
] as const;

function dispatchDemoShortcut(key: "p" | "r") {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      key,
      shiftKey: true,
      bubbles: true,
    }),
  );
}

function normalizeRequestId(requestId: string) {
  const decoded = decodeURIComponent(requestId).trim();

  return decoded || "STC-TR-2026-0031";
}

export function OfficerIndividualCaseShell({
  requestId,
}: OfficerIndividualCaseShellProps) {
  const router = useRouter();
  const normalizedRequestId = useMemo(
    () => normalizeRequestId(requestId),
    [requestId],
  );

  const [recordVerified, setRecordVerified] =
    useState(false);
  const [discrepancyReviewed, setDiscrepancyReviewed] =
    useState(false);
  const [caseStatus, setCaseStatus] =
    useState("In review");
  const [activeStage, setActiveStage] =
    useState(2);
  const [noteDraft, setNoteDraft] =
    useState("");
  const [caseTab, setCaseTab] = useState<
    "record" | "comments" | "history" | "output" | "audit"
  >("record");
  const [activity, setActivity] = useState<
    readonly ActivityItem[]
  >([
    {
      id: "assigned",
      label: "Assigned to you",
      time: "Today, 9:14 AM",
      current: true,
    },
    {
      id: "finance",
      label: "Payment verified by Finance",
      time: "Yesterday, 3:42 PM",
    },
    {
      id: "submitted",
      label: "Request submitted",
      time: "Yesterday, 2:18 PM",
    },
  ]);

  const referralHref =
    `/demo/officer/requests/${encodeURIComponent(
      normalizedRequestId,
    )}?view=refer`;

  function addActivity(
    label: string,
    time = "Just now",
  ) {
    setActivity((current) => [
      {
        id: `${label}-${current.length}`,
        label,
        time,
        current: true,
      },
      ...current.map((item) => ({
        ...item,
        current: false,
      })),
    ]);
  }

  function completeReview() {
    if (!recordVerified) {
      setCaseStatus("Verification required");
      return;
    }

    setCaseStatus("Ready for approval");
    setActiveStage(3);
    addActivity(
      "Records review completed and sent for approval",
    );
  }

  function requestInformation() {
    setCaseStatus("Awaiting applicant");
    addActivity(
      "Additional information requested from applicant",
    );
  }

  function addInternalNote() {
    const note = noteDraft.trim();

    if (!note) {
      return;
    }

    addActivity(`Internal note added: ${note}`);
    setNoteDraft("");
  }

  return (
    <InternalAppShell
      role="OFFICER"
      institutionName="Savannah Technical College"
      institutionSubtitle="Student Services"
      institutionInitials="STC"
      staffName="Kevin Mwangi"
      staffRoleLabel="Registry Officer"
      requestSelector={
        <label className={styles.requestSelector}>
          <span>Request</span>
          <select
            aria-label="Select officer request"
            value={normalizedRequestId}
            onChange={(event) =>
              router.push(
                `/demo/officer/requests/${encodeURIComponent(
                  event.target.value,
                )}`,
              )
            }
          >
            <option value={normalizedRequestId}>
              {normalizedRequestId} — {caseStatus}
            </option>
            <option value="STC-TR-2026-0038">
              STC-TR-2026-0038 — Additional check
            </option>
            <option value="REQ-DEMO-001">
              REQ-DEMO-001 — Transcript request
            </option>
          </select>
        </label>
      }
      presentationAction={
        <button
          type="button"
          className="button-base button-compact button-secondary"
          onClick={() => dispatchDemoShortcut("p")}
        >
          Present
        </button>
      }
      resetAction={
        <button
          type="button"
          className="button-base button-compact button-destructive"
          onClick={() => dispatchDemoShortcut("r")}
        >
          Reset
        </button>
      }
    >
      <main
        className={styles.page}
        aria-labelledby="individual-case-title"
        data-officer-individual-case="true"
      >
        <nav
          className={styles.breadcrumbs}
          aria-label="Breadcrumb"
        >
          <Link href="/demo/officer#application-queue">
            My Queue
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/demo/officer#application-queue">
            Transcript Requests
          </Link>
          <span aria-hidden="true">/</span>
          <span>{normalizedRequestId}</span>
        </nav>

        <header className={styles.caseHeader}>
          <div className={styles.caseHeading}>
            <div className={styles.titleRow}>
              <h1 id="individual-case-title">
                Transcript Request
              </h1>
              <button
                type="button"
                className={styles.copyButton}
                aria-label={`Copy request ID ${normalizedRequestId}`}
                onClick={() =>
                  void navigator.clipboard?.writeText(
                    normalizedRequestId,
                  )
                }
              >
                <Copy aria-hidden="true" />
              </button>
              <span className={styles.requestId}>
                #{normalizedRequestId}
              </span>
            </div>
            <p>
              Submitted by Brian Otieno · Diploma in
              Electrical Engineering
            </p>
          </div>

          <div className={styles.headerActions}>
            <span
              className={styles.statusBadge}
              data-status={caseStatus
                .toLowerCase()
                .replaceAll(" ", "-")}
            >
              {caseStatus}
            </span>
            <span className={styles.dueBadge}>
              <Clock3 aria-hidden="true" />
              1d 6h remaining
            </span>
            <Link
              className={styles.referralButton}
              href={referralHref}
              data-share-workflow-referral-link="true"
            >
              Share Workflow / Refer Case
            </Link>
            <button
              type="button"
              className={styles.moreButton}
              aria-label="More case actions"
            >
              <MoreHorizontal aria-hidden="true" />
            </button>
          </div>
        </header>

        <section
          className={styles.workflow}
          aria-label="Request workflow"
        >
          <ol>
            {WORKFLOW_STAGES.map((stage, index) => {
              const state =
                index < activeStage
                  ? "complete"
                  : index === activeStage
                    ? "current"
                    : "pending";

              return (
                <li
                  key={stage.label}
                  data-state={state}
                >
                  <span
                    className={styles.workflowMarker}
                    aria-hidden="true"
                  >
                    {state === "complete" ? (
                      <Check size={18} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div>
                    <strong>{stage.label}</strong>
                    <span>
                      {state === "pending"
                        ? "Pending"
                        : stage.date}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section
          className={styles.caseManagementRecord}
          aria-labelledby="case-management-title"
          data-case-management-record="true"
        >
          <header className={styles.caseManagementHeader}>
            <div>
              <p>Case management record</p>
              <h2 id="case-management-title">
                CASE-{normalizedRequestId.replace(/[^A-Z0-9]/gi, "")}
              </h2>
              <span>
                One complete operational record for this request.
              </span>
            </div>
            <strong>Audit enabled</strong>
          </header>

          <div className={styles.caseTabs} role="tablist" aria-label="Case record sections">
            {[
              ["record", "Case record"],
              ["comments", "Comments"],
              ["history", "Status history"],
              ["output", "Final output"],
              ["audit", "Audit log"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={caseTab === value}
                data-active={caseTab === value ? "true" : undefined}
                onClick={() => setCaseTab(value as typeof caseTab)}
              >
                {label}
              </button>
            ))}
          </div>

          {caseTab === "record" ? (
            <div className={styles.caseRecordGrid}>
              <article>
                <h3>Applicant details</h3>
                <dl>
                  <div><dt>Name</dt><dd>Brian Otieno</dd></div>
                  <div><dt>Admission no.</dt><dd>STC/DEE/2023/041</dd></div>
                  <div><dt>Programme</dt><dd>Diploma in Electrical Engineering</dd></div>
                  <div><dt>Contact</dt><dd>+254 712 345 678</dd></div>
                </dl>
              </article>
              <article>
                <h3>Documents</h3>
                <ul>
                  <li><span>National ID.pdf</span><strong>Verified</strong></li>
                  <li><span>Graduation clearance.pdf</span><strong>Verified</strong></li>
                  <li><span>Payment receipt.pdf</span><strong>Verified</strong></li>
                </ul>
              </article>
              <article>
                <h3>Payment / reference status</h3>
                <dl>
                  <div><dt>Fee</dt><dd>KES 1,500</dd></div>
                  <div><dt>Reference</dt><dd>MP-48291</dd></div>
                  <div><dt>Status</dt><dd>Confirmed</dd></div>
                  <div><dt>Verified by</dt><dd>Mercy Wanjiku</dd></div>
                </dl>
              </article>
              <article>
                <h3>Current step</h3>
                <dl>
                  <div><dt>Step</dt><dd>Records review</dd></div>
                  <div><dt>Department</dt><dd>Student Records</dd></div>
                  <div><dt>Due</dt><dd>1d 6h remaining</dd></div>
                  <div><dt>Public status</dt><dd>Additional checks in progress</dd></div>
                </dl>
              </article>
              <article>
                <h3>Assigned officer</h3>
                <dl>
                  <div><dt>Officer</dt><dd>Kevin Mwangi</dd></div>
                  <div><dt>Role</dt><dd>Registry Officer</dd></div>
                  <div><dt>Assigned</dt><dd>Today, 9:13 AM</dd></div>
                  <div><dt>Owner</dt><dd>Student Records</dd></div>
                </dl>
              </article>
              <article>
                <h3>Final output</h3>
                <dl>
                  <div><dt>Type</dt><dd>Official academic transcript</dd></div>
                  <div><dt>Status</dt><dd>Not yet issued</dd></div>
                  <div><dt>Delivery</dt><dd>Secure digital copy</dd></div>
                  <div><dt>Reference</dt><dd>Generated after approval</dd></div>
                </dl>
              </article>
            </div>
          ) : null}

          {caseTab === "comments" ? (
            <div className={styles.caseComments}>
              <article>
                <header><strong>Kevin Mwangi</strong><span>Today, 9:28 AM</span></header>
                <p>Identity and payment documents have been checked. Academic record discrepancy requires confirmation.</p>
                <small>Internal team</small>
              </article>
              <article>
                <header><strong>Mercy Wanjiku</strong><span>Yesterday, 3:42 PM</span></header>
                <p>Payment reference MP-48291 matched to the transcript service fee.</p>
                <small>Internal team</small>
              </article>
            </div>
          ) : null}

          {caseTab === "history" ? (
            <ol className={styles.caseHistory}>
              <li><strong>Records review</strong><span>Assigned to Kevin Mwangi in Student Records.</span><time>Today, 9:14 AM</time></li>
              <li><strong>Payment verified</strong><span>Finance confirmed payment reference MP-48291.</span><time>Yesterday, 3:42 PM</time></li>
              <li><strong>Request submitted</strong><span>Applicant submitted the form and three documents.</span><time>Yesterday, 2:18 PM</time></li>
            </ol>
          ) : null}

          {caseTab === "output" ? (
            <div className={styles.caseOutput}>
              <h3>Official academic transcript</h3>
              <p>The final output will be generated after Registrar approval and stored against this case.</p>
              <dl>
                <div><dt>Status</dt><dd>Pending approval</dd></div>
                <div><dt>Template</dt><dd>Transcript v1</dd></div>
                <div><dt>Delivery</dt><dd>Secure digital copy</dd></div>
                <div><dt>Audit action</dt><dd>DOCUMENT_ISSUED</dd></div>
              </dl>
            </div>
          ) : null}

          {caseTab === "audit" ? (
            <div className={styles.caseAudit}>
              <p>Append-only technical events. Applicant-facing history remains separate.</p>
              <div>
                <table>
                  <thead><tr><th>Event</th><th>Action</th><th>Actor</th><th>Entity</th><th>Previous</th><th>New</th><th>Time</th></tr></thead>
                  <tbody>
                    <tr><td>AUD-00041</td><td>REQUEST_VIEWED</td><td>Kevin Mwangi</td><td>Request</td><td>Unopened</td><td>Opened</td><td>Today, 9:14 AM</td></tr>
                    <tr><td>AUD-00039</td><td>REQUEST_ASSIGNED</td><td>System</td><td>Assignment</td><td>Unassigned</td><td>Kevin Mwangi</td><td>Today, 9:13 AM</td></tr>
                    <tr><td>AUD-00034</td><td>PAYMENT_CONFIRMED</td><td>Mercy Wanjiku</td><td>Payment</td><td>Pending</td><td>Confirmed</td><td>Yesterday, 3:42 PM</td></tr>
                    <tr><td>AUD-00028</td><td>REQUEST_SUBMITTED</td><td>Brian Otieno</td><td>Request</td><td>Draft</td><td>Submitted</td><td>Yesterday, 2:18 PM</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>

        <div className={styles.caseGrid}>
          <div className={styles.mainColumn}>
            <section className={styles.card}>
              <h2>Request details</h2>
              <dl className={styles.detailGrid}>
                <div>
                  <dt>Student name</dt>
                  <dd>Brian Otieno</dd>
                </div>
                <div>
                  <dt>Admission no.</dt>
                  <dd>STC/DEE/2023/041</dd>
                </div>
                <div>
                  <dt>Programme</dt>
                  <dd>
                    Diploma in Electrical Engineering
                  </dd>
                </div>
                <div>
                  <dt>Graduation year</dt>
                  <dd>2025</dd>
                </div>
                <div>
                  <dt>Delivery method</dt>
                  <dd>Secure digital copy</dd>
                </div>
                <div>
                  <dt>Purpose</dt>
                  <dd>Employment</dd>
                </div>
              </dl>
            </section>

            <section className={styles.card}>
              <h2>Submitted documents</h2>
              <div className={styles.documentList}>
                {DOCUMENTS.map((document) => (
                  <article key={document.id}>
                    <FileText aria-hidden="true" />
                    <strong>{document.name}</strong>
                    <span>
                      <CheckCircle2
                        aria-hidden="true"
                      />
                      {document.result}
                    </span>
                    <a
                      href={`#${document.id}`}
                      aria-label={`View ${document.name}`}
                    >
                      View
                    </a>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.card}>
              <h2>Academic record verification</h2>

              <div className={styles.tableWrap}>
                <table>
                  <caption className="sr-only">
                    Academic record verification
                  </caption>
                  <thead>
                    <tr>
                      <th>Semester</th>
                      <th>Units</th>
                      <th>Results status</th>
                      <th>Clearance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ACADEMIC_RECORD.map((record) => (
                      <tr
                        key={record.semester}
                        data-warning={
                          record.warning
                            ? "true"
                            : undefined
                        }
                      >
                        <td>{record.semester}</td>
                        <td>{record.units}</td>
                        <td>
                          <span
                            className={
                              record.warning
                                ? styles.warningResult
                                : styles.completeResult
                            }
                          >
                            <span aria-hidden="true" />
                            {record.result}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              styles.clearanceResult
                            }
                          >
                            <CheckCircle2
                              aria-hidden="true"
                            />
                            {record.clearance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className={styles.discrepancy}
                role="status"
              >
                <span aria-hidden="true">!</span>
                <strong>
                  EEE 224 grade differs from the
                  archived marksheet.
                </strong>
              </div>

              <div className={styles.inlineActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    setDiscrepancyReviewed(true);
                    addActivity(
                      "Academic discrepancy reviewed",
                    );
                  }}
                >
                  {discrepancyReviewed
                    ? "Discrepancy reviewed"
                    : "Review discrepancy"}
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() =>
                    addActivity(
                      "Student academic record opened",
                    )
                  }
                >
                  Open student record
                </button>
              </div>
            </section>
          </div>

          <aside className={styles.sideColumn}>
            <section className={styles.card}>
              <h2>Next action</h2>
              <p className={styles.cardIntro}>
                Complete records review
              </p>

              <ul className={styles.checklist}>
                <li data-complete="true">
                  <CheckCircle2 aria-hidden="true" />
                  Identity confirmed
                </li>
                <li data-complete="true">
                  <CheckCircle2 aria-hidden="true" />
                  Payment confirmed
                </li>
                <li>
                  <label>
                    <input
                      type="checkbox"
                      checked={recordVerified}
                      onChange={(event) =>
                        setRecordVerified(
                          event.target.checked,
                        )
                      }
                    />
                    <span
                      className={
                        styles.checkboxMarker
                      }
                      aria-hidden="true"
                    >
                      {recordVerified ? (
                        <Check size={14} />
                      ) : (
                        <Circle size={16} />
                      )}
                    </span>
                    Academic record verified
                  </label>
                </li>
              </ul>

              <div className={styles.actionStack}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={completeReview}
                >
                  Complete review
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={requestInformation}
                >
                  Request information
                </button>
              </div>

              <p className={styles.actionHelp}>
                Completing this step sends the request
                to the Registrar for approval.
              </p>
            </section>

            <section className={styles.card}>
              <h2>Applicant</h2>
              <div className={styles.applicant}>
                <div
                  className={styles.avatar}
                  aria-hidden="true"
                >
                  BO
                </div>
                <div className={styles.applicantDetails}>
                  <strong>Brian Otieno</strong>
                  <span>
                    <Phone aria-hidden="true" />
                    +254 712 345 678
                  </span>
                  <span>
                    <Mail aria-hidden="true" />
                    brian.otieno@email.com
                  </span>
                </div>
                <a href="#applicant-profile">
                  View profile
                </a>
              </div>
            </section>

            <section
              className={styles.card}
              id="case-activity"
            >
              <h2>Case activity</h2>

              <ol className={styles.activityList}>
                {activity.map((item) => (
                  <li
                    key={item.id}
                    data-current={
                      item.current
                        ? "true"
                        : undefined
                    }
                  >
                    <span
                      className={styles.activityDot}
                      aria-hidden="true"
                    />
                    <strong>{item.label}</strong>
                    <time>{item.time}</time>
                  </li>
                ))}
              </ol>

              <label
                className={styles.noteLabel}
                htmlFor="officer-internal-note"
              >
                <span className="sr-only">
                  Add an internal note
                </span>
                <textarea
                  id="officer-internal-note"
                  value={noteDraft}
                  onChange={(event) =>
                    setNoteDraft(event.target.value)
                  }
                  placeholder="Add an internal note…"
                  rows={3}
                />
              </label>
              <div className={styles.noteAction}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={addInternalNote}
                >
                  Add note
                </button>
              </div>
            </section>

            <section className={styles.securityNote}>
              <ShieldCheck aria-hidden="true" />
              <p>
                Internal notes and workflow referrals
                remain staff-only in this demonstration.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </InternalAppShell>
  );
}
