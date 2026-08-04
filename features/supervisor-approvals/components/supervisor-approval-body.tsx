"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  FileText,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type {
  FormEventHandler,
} from "react";

import type {
  SupervisorApprovalDetailModel,
} from "@/features/supervisor-approvals/model/supervisor-approval-model";

import styles from "./supervisor-workspace.module.css";

type SupervisorApprovalBodyProps = {
  readonly model: SupervisorApprovalDetailModel;
  readonly approvalReady: boolean;
  readonly rejectionReady: boolean;
  readonly decisionConfirmed: boolean;
  readonly internalNote: string;
  readonly rejectionReason: string;
  readonly clarificationReason: string;
  readonly feedbackMessage: string | null;
  readonly errorMessage: string | null;
  readonly onDecisionConfirmedChange: (
    value: boolean,
  ) => void;
  readonly onInternalNoteChange: (
    value: string,
  ) => void;
  readonly onRejectionReasonChange: (
    value: string,
  ) => void;
  readonly onClarificationReasonChange: (
    value: string,
  ) => void;
  readonly onApprove: () => void;
  readonly onReject: FormEventHandler<HTMLFormElement>;
  readonly onReturn: FormEventHandler<HTMLFormElement>;
};

function StatusBadge({
  label,
  tone,
}: {
  readonly label: string;
  readonly tone: string;
}) {
  return (
    <span
      className={styles.statusBadge}
      data-tone={tone}
    >
      {label}
    </span>
  );
}

export function SupervisorApprovalBody({
  model,
  approvalReady,
  rejectionReady,
  decisionConfirmed,
  internalNote,
  rejectionReason,
  clarificationReason,
  feedbackMessage,
  errorMessage,
  onDecisionConfirmedChange,
  onInternalNoteChange,
  onRejectionReasonChange,
  onClarificationReasonChange,
  onApprove,
  onReject,
  onReturn,
}: SupervisorApprovalBodyProps) {
  return (
    <main
      className={styles.workspace}
      data-d29r6-supervisor-approval="true"
    >
      <nav
        className={styles.breadcrumbs}
        aria-label="Breadcrumb"
      >
        <Link href="/demo/supervisor">
          Supervisor
        </Link>
        <ChevronRight aria-hidden="true" />
        <Link href="/demo/supervisor#approvals">
          Approval Queue
        </Link>
        <ChevronRight aria-hidden="true" />
        <strong>{model.requestId}</strong>
      </nav>

      <header className={styles.approvalHeader}>
        <div>
          <h1>Registrar approval</h1>
          <p>
            Review completed operational checks and record the
            formal decision.
          </p>
        </div>

        <Link
          href="/demo/supervisor"
          className={styles.compactButton}
        >
          <ArrowLeft aria-hidden="true" />
          Approval queue
        </Link>
      </header>

      {feedbackMessage ? (
        <div
          role="status"
          className={styles.feedbackBanner}
        >
          <CheckCircle2 aria-hidden="true" />
          <span>{feedbackMessage}</span>
        </div>
      ) : null}

      {errorMessage ? (
        <div
          role="alert"
          className={styles.errorBanner}
        >
          <CircleAlert aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <section
        className={styles.metricGrid}
        aria-label="Approval status metrics"
      >
        {[
          {
            label: "Pending approval",
            value:
              !model.existingDecision &&
              approvalReady
                ? 1
                : 0,
            tone: "purple",
            icon: BadgeCheck,
          },
          {
            label: "Blocked checks",
            value:
              model.prerequisites.filter(
                (item) => !item.passed,
              ).length,
            tone: "orange",
            icon: CircleAlert,
          },
          {
            label: "Approved",
            value:
              model.existingDecision?.decision ===
              "APPROVED"
                ? 1
                : 0,
            tone: "green",
            icon: CheckCircle2,
          },
          {
            label: "Rejected",
            value:
              model.existingDecision?.decision ===
              "REJECTED"
                ? 1
                : 0,
            tone: "red",
            icon: XCircle,
          },
          {
            label: "Finance result",
            value:
              model.financeResult ?? "—",
            tone:
              model.financeResult === "CLEAR"
                ? "green"
                : model.financeResult
                  ? "orange"
                  : "blue",
            icon: FileCheck2,
          },
          {
            label: "Required checks",
            value: `${
              model.prerequisites.filter(
                (item) => item.passed,
              ).length
            }/${model.prerequisites.length}`,
            tone: "blue",
            icon: ShieldCheck,
          },
        ].map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className={styles.metricCard}
              data-tone={metric.tone}
            >
              <span
                className={styles.metricIcon}
                aria-hidden="true"
              >
                <Icon />
              </span>
              <div className={styles.metricCopy}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            </article>
          );
        })}
      </section>

      <div className={styles.approvalGrid}>
        <div className={styles.stack}>
          <section className={styles.panel}>
            <header className={styles.panelHeader}>
              <div>
                <h2>Request Summary</h2>
                <p className="text-reference">
                  {model.requestId}
                </p>
              </div>
              <StatusBadge
                label={model.currentStatusLabel}
                tone={model.currentStatusTone}
              />
            </header>

            <div className={styles.summaryBody}>
              <div className={styles.requestHero}>
                <div className={styles.requestIdentity}>
                  <span
                    className={styles.avatar}
                    aria-hidden="true"
                  >
                    {model.applicantInitials}
                  </span>
                  <span>
                    <strong>
                      {model.serviceName}
                    </strong>
                    <span>
                      Applicant:{" "}
                      {model.applicantName}
                    </span>
                  </span>
                </div>

                <Link
                  href={`/demo/officer/requests/${model.requestId}`}
                  className={styles.actionLink}
                >
                  Officer review
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>

              <dl className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                  <dt>Parent owner</dt>
                  <dd>{model.parentOwnerName}</dd>
                </div>
                <div className={styles.summaryCard}>
                  <dt>Approval department</dt>
                  <dd>
                    {model.registrarDepartmentName}
                  </dd>
                </div>
                <div className={styles.summaryCard}>
                  <dt>Decision authority</dt>
                  <dd>
                    {model.decisionAuthorityName}
                  </dd>
                </div>
                <div className={styles.summaryCard}>
                  <dt>Submitted</dt>
                  <dd>{model.submittedLabel}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className={styles.panel}>
            <header className={styles.panelHeader}>
              <div>
                <h2>Approval Gate</h2>
                <p>
                  All prerequisites must pass before approval.
                </p>
              </div>
            </header>

            <ul className={styles.prerequisiteList}>
              {model.prerequisites.map((item) => (
                <li key={item.id}>
                  <span
                    className={styles.checkIcon}
                    data-passed={
                      item.passed
                        ? "true"
                        : "false"
                    }
                    aria-hidden="true"
                  >
                    {item.passed ? (
                      <CheckCircle2 />
                    ) : (
                      <CircleAlert />
                    )}
                  </span>

                  <span>
                    <strong>{item.label}</strong>
                    <span>{item.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.panel}>
            <header className={styles.panelHeader}>
              <div>
                <h2>Finance Result</h2>
                <p>
                  Structured departmental result returned to
                  Student Records.
                </p>
              </div>
            </header>

            <div className={styles.financeBody}>
              <div className={styles.financeResult}>
                <span aria-hidden="true">
                  <FileCheck2 />
                </span>

                <div>
                  <strong>
                    {model.financeResult ??
                      "Not available"}
                  </strong>
                  <p>{model.financeNote}</p>
                  {model.financeCompletedBy ? (
                    <p>
                      Completed by{" "}
                      {model.financeCompletedBy} ·{" "}
                      {
                        model.financeCompletedAtLabel
                      }
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className={styles.panel}>
            <header className={styles.panelHeader}>
              <div>
                <h2>Submitted Record</h2>
                <p>
                  Required application responses and documents.
                </p>
              </div>
            </header>

            <div className={styles.recordBody}>
              <dl className={styles.recordGrid}>
                {model.applicationItems.map(
                  (item) => (
                    <div
                      key={item.id}
                      className={styles.recordItem}
                    >
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ),
                )}
              </dl>

              <ul className={styles.documentList}>
                {model.documents.map(
                  (document) => (
                    <li key={document.id}>
                      <FileText aria-hidden="true" />
                      <span>
                        <strong>
                          {document.name}
                        </strong>
                        <span>
                          {document.levelLabel}
                        </span>
                      </span>
                      <StatusBadge
                        label={
                          document.statusLabel
                        }
                        tone={
                          document.available
                            ? "green"
                            : "orange"
                        }
                      />
                    </li>
                  ),
                )}
              </ul>
            </div>
          </section>
        </div>

        <aside
          className={[
            styles.panel,
            styles.decisionPanel,
          ].join(" ")}
        >
          <header className={styles.panelHeader}>
            <div>
              <h2>Registrar Decision</h2>
              <p>
                Record one formal and immutable decision.
              </p>
            </div>
          </header>

          <div className={styles.decisionBody}>
            {model.existingDecision ? (
              <>
                <div
                  className={styles.decisionResult}
                  data-decision={
                    model.existingDecision.decision
                  }
                >
                  <strong>
                    {model.existingDecision.decision.replaceAll(
                      "_",
                      " ",
                    )}
                  </strong>
                  <p>
                    {
                      model.existingDecision.applicantReason
                    }
                  </p>
                  <p>
                    {
                      model.existingDecision.decidedBy
                    }{" "}
                    ·{" "}
                    {
                      model.existingDecision.decidedAtLabel
                    }
                  </p>
                </div>

                {model.existingDecision.decision ===
                "APPROVED" ? (
                  <Link
                    href={`/demo/outcomes/${model.requestId}`}
                    className={styles.primaryButton}
                  >
                    Continue to outcome issuance
                    <ArrowRight aria-hidden="true" />
                  </Link>
                ) : null}
              </>
            ) : (
              <>
                <label>
                  Internal decision note
                  <textarea
                    value={internalNote}
                    onChange={(event) =>
                      onInternalNoteChange(
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className={styles.declaration}>
                  <input
                    type="checkbox"
                    checked={decisionConfirmed}
                    onChange={(event) =>
                      onDecisionConfirmedChange(
                        event.target.checked,
                      )
                    }
                  />
                  <span>
                    I confirm that I am acting as the
                    Registrar-profile Supervisor and have
                    reviewed the request record and completed
                    operational checks.
                  </span>
                </label>

                <div className={styles.decisionActions}>
                  <button
                    type="button"
                    onClick={onApprove}
                    disabled={!approvalReady}
                    className={styles.primaryButton}
                  >
                    <CheckCircle2 aria-hidden="true" />
                    Approve request
                  </button>

                  {!approvalReady ? (
                    <p className={styles.boundaryNote}>
                      Approval remains blocked until all
                      prerequisite checks pass and Finance
                      returns CLEAR.
                    </p>
                  ) : null}

                  <form
                    onSubmit={onReject}
                    className={styles.inlineForm}
                  >
                    <label>
                      Applicant-visible rejection reason
                      <textarea
                        value={rejectionReason}
                        onChange={(event) =>
                          onRejectionReasonChange(
                            event.target.value,
                          )
                        }
                        placeholder="Explain why the request cannot be approved."
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={!rejectionReady}
                      className={styles.dangerButton}
                    >
                      <XCircle aria-hidden="true" />
                      Record rejection
                    </button>
                  </form>

                  <form
                    onSubmit={onReturn}
                    className={styles.inlineForm}
                  >
                    <label>
                      Clarification required
                      <textarea
                        value={clarificationReason}
                        onChange={(event) =>
                          onClarificationReasonChange(
                            event.target.value,
                          )
                        }
                        placeholder="Explain what Student Records must resolve."
                      />
                    </label>

                    <button
                      type="submit"
                      className={styles.secondaryButton}
                    >
                      <RotateCcw aria-hidden="true" />
                      Return to Student Records
                    </button>
                  </form>
                </div>
              </>
            )}

            <div className={styles.boundaryNote}>
              This stage records the Registrar decision only.
              Controlled outcome issuance remains a separate
              step.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
