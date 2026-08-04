"use client";

import Link from "next/link";
import type {
  FormEventHandler,
  ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Eye,
  FileCheck2,
  FileText,
  Info,
  MessageSquareText,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import type {
  OfficerReviewReferralModel,
  ReviewOfficerOption,
  ReviewReasonOption,
} from "@/features/officer-review/model/officer-review-model";
import { OFFICER_ROUTE_HREFS } from "@/features/demo-engine/navigation/officer-navigation-contract";

import styles from "./officer-review-referral-body.module.css";

type ChecklistKey =
  | "application"
  | "documents"
  | "identity";

type ShareKey =
  | "notes"
  | "sla"
  | "audit";

type OfficerReviewReferralBodyProps = {
  readonly model: OfficerReviewReferralModel;
  readonly reviewStarted: boolean;
  readonly checklist: Readonly<Record<ChecklistKey, boolean>>;
  readonly internalNote: string;
  readonly correctionOpen: boolean;
  readonly correctionReason: string;
  readonly correctionInstructions: string;
  readonly referralDepartmentId: string;
  readonly officerId: string;
  readonly referralReason: string;
  readonly urgency: "LOW" | "NORMAL" | "HIGH";
  readonly requestedAction: string;
  readonly expectedOutput: string;
  readonly dueDate: string;
  readonly shareSelections: Readonly<Record<ShareKey, boolean>>;
  readonly departments: readonly {
    readonly id: string;
    readonly name: string;
  }[];
  readonly officers: readonly ReviewOfficerOption[];
  readonly reasons: readonly ReviewReasonOption[];
  readonly referralSummary?: {
    readonly departmentName: string;
    readonly statusLabel: string;
  } | null;
  readonly feedbackMessage: string | null;
  readonly errorMessage: string | null;
  readonly onStartReview: () => void;
  readonly onInternalNoteChange: (value: string) => void;
  readonly onSaveInternalNote: FormEventHandler<HTMLFormElement>;
  readonly onCorrectionToggle: () => void;
  readonly onCorrectionReasonChange: (value: string) => void;
  readonly onCorrectionInstructionsChange: (value: string) => void;
  readonly onRequestCorrection: FormEventHandler<HTMLFormElement>;
  readonly onChecklistChange: (
    key: ChecklistKey,
    checked: boolean,
  ) => void;
  readonly onShareSelectionChange: (
    key: ShareKey,
    checked: boolean,
  ) => void;
  readonly onReferralDepartmentChange: (value: string) => void;
  readonly onOfficerChange: (value: string) => void;
  readonly onReferralReasonChange: (value: string) => void;
  readonly onUrgencyChange: (
    value: "LOW" | "NORMAL" | "HIGH",
  ) => void;
  readonly onRequestedActionChange: (value: string) => void;
  readonly onExpectedOutputChange: (value: string) => void;
  readonly onDueDateChange: (value: string) => void;
  readonly onPreview: () => void;
  readonly onCreateReferral: FormEventHandler<HTMLFormElement>;
};

function ActionLink({
  href,
  children,
}: {
  readonly href: string;
  readonly children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={styles.actionLink}
    >
      {children}
      <ArrowRight aria-hidden="true" />
    </Link>
  );
}

function Panel({
  title,
  icon,
  action,
  children,
  className = "",
}: {
  readonly title: string;
  readonly icon?: ReactNode;
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <section
      className={[
        styles.panel,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className={styles.panelHeader}>
        <div className={styles.panelTitle}>
          {icon}
          <h2>{title}</h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  readonly children: ReactNode;
  readonly required?: boolean;
}) {
  return (
    <span className={styles.fieldLabel}>
      {children}
      {required ? (
        <span aria-hidden="true">*</span>
      ) : null}
    </span>
  );
}

export function OfficerReviewReferralBody({
  model,
  reviewStarted,
  checklist,
  internalNote,
  correctionOpen,
  correctionReason,
  correctionInstructions,
  referralDepartmentId,
  officerId,
  referralReason,
  urgency,
  requestedAction,
  expectedOutput,
  dueDate,
  shareSelections,
  departments,
  officers,
  reasons,
  referralSummary,
  feedbackMessage,
  errorMessage,
  onStartReview,
  onInternalNoteChange,
  onSaveInternalNote,
  onCorrectionToggle,
  onCorrectionReasonChange,
  onCorrectionInstructionsChange,
  onRequestCorrection,
  onChecklistChange,
  onShareSelectionChange,
  onReferralDepartmentChange,
  onOfficerChange,
  onReferralReasonChange,
  onUrgencyChange,
  onRequestedActionChange,
  onExpectedOutputChange,
  onDueDateChange,
  onPreview,
  onCreateReferral,
}: OfficerReviewReferralBodyProps) {
  const filteredOfficers = officers.filter(
    (officer) =>
      departments.find(
        (department) =>
          department.id === referralDepartmentId,
      )?.name === officer.departmentName,
  );

  const checklistComplete =
    checklist.application &&
    checklist.documents &&
    checklist.identity;

  return (
    <main
      className={styles.reviewPage}
      data-d29r4-officer-review-body="true"
    >
      <nav
        className={styles.breadcrumbs}
        aria-label="Breadcrumb"
      >
        <Link href={OFFICER_ROUTE_HREFS.home}>
          Officer Desk
        </Link>
        <ChevronRight aria-hidden="true" />
        <Link href={OFFICER_ROUTE_HREFS.queue}>
          My Tasks
        </Link>
        <ChevronRight aria-hidden="true" />
        <span>Application {model.requestId}</span>
        <ChevronRight aria-hidden="true" />
        <strong>Share Workflow</strong>
      </nav>

      <header className={styles.pageHeader}>
        <div>
          <h1>Share Workflow / Refer Case</h1>
          <p>
            Share this application with a colleague or another
            department for review or assistance.
          </p>
        </div>

        <Link
          href={OFFICER_ROUTE_HREFS.queue}
          className={styles.backButton}
        >
          <ArrowLeft aria-hidden="true" />
          Back to Application
        </Link>
      </header>

      {errorMessage ? (
        <div
          role="alert"
          className={styles.errorBanner}
        >
          <CircleAlert aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {feedbackMessage ? (
        <div
          role="status"
          className={styles.feedbackBanner}
        >
          <CheckCircle2 aria-hidden="true" />
          <span>{feedbackMessage}</span>
        </div>
      ) : null}

      <div className={styles.reviewGrid}>
        <div className={styles.leftStack}>
          <Panel
            title="Application Details"
            icon={
              <FileText aria-hidden="true" />
            }
            action={
              <span
                className={styles.slaBadge}
                data-tone="green"
              >
                <span aria-hidden="true" />
                Within SLA
              </span>
            }
          >
            <div className={styles.applicationBody}>
              <div className={styles.applicantSummary}>
                <span
                  className={styles.applicantAvatar}
                  aria-hidden="true"
                >
                  {model.applicant.initials}
                </span>

                <div className={styles.applicantIdentity}>
                  <strong>{model.applicant.name}</strong>
                  <span>{model.applicant.email}</span>
                  <span>{model.applicant.phone}</span>
                </div>

                <dl className={styles.applicationReference}>
                  <div>
                    <dt>Application ID</dt>
                    <dd className="text-reference">
                      {model.requestId}
                    </dd>
                  </div>
                  <div>
                    <dt>Submitted On</dt>
                    <dd>{model.submittedLabel}</dd>
                  </div>
                </dl>
              </div>

              <dl className={styles.applicationMetadata}>
                <div>
                  <dt>Request Type</dt>
                  <dd>{model.serviceName}</dd>
                </div>
                <div>
                  <dt>Category</dt>
                  <dd>{model.categoryLabel}</dd>
                </div>
                <div>
                  <dt>Current Step</dt>
                  <dd>
                    <span
                      className={styles.stepBadge}
                      data-tone={model.statusTone}
                    >
                      {model.currentStepLabel}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>SLA</dt>
                  <dd className={styles.slaText}>
                    {model.slaLabel}
                  </dd>
                </div>
              </dl>

              <div className={styles.ownerLine}>
                <ShieldCheck aria-hidden="true" />
                <span>
                  Parent owner:{" "}
                  <strong>
                    {model.parentOwnerLabel}
                  </strong>
                </span>
              </div>

              <div className={styles.reviewMaterials}>
                <div>
                  <h3>Applicant responses</h3>
                  <dl>
                    {model.responseItems.map((item) => (
                      <div key={item.id}>
                        <dt>{item.label}</dt>
                        <dd>{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <h3>
                    Documents{" "}
                    <span>
                      {model.availableDocumentCount}/
                      {model.totalDocumentCount}
                    </span>
                  </h3>
                  <ul>
                    {model.documentItems.map((item) => (
                      <li key={item.id}>
                        <FileCheck2 aria-hidden="true" />
                        <span>
                          <strong>{item.name}</strong>
                          <small>{item.fileSummary}</small>
                        </span>
                        <span
                          className={styles.documentState}
                          data-available={
                            item.available
                              ? "true"
                              : "false"
                          }
                        >
                          {item.available
                            ? "Available"
                            : "Missing"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            title="Notes (Internal)"
            icon={
              <MessageSquareText aria-hidden="true" />
            }
          >
            <div className={styles.notesBody}>
              {model.noteItems.length > 0 ? (
                <article className={styles.latestNote}>
                  <p>
                    {
                      model.noteItems[
                        model.noteItems.length - 1
                      ]?.body
                    }
                  </p>
                  <span>
                    Added{" "}
                    {
                      model.noteItems[
                        model.noteItems.length - 1
                      ]?.timestampLabel
                    }
                  </span>
                </article>
              ) : (
                <article className={styles.latestNote}>
                  <p>
                    Review the submitted documents and add a
                    staff-only observation where required.
                  </p>
                  <span>
                    Internal notes are not shown to applicants.
                  </span>
                </article>
              )}

              <form
                onSubmit={onSaveInternalNote}
                className={styles.noteComposer}
              >
                <label>
                  <span className="sr-only">
                    Internal note
                  </span>
                  <textarea
                    rows={3}
                    value={internalNote}
                    disabled={!reviewStarted}
                    placeholder="Add an internal review note"
                    onChange={(event) =>
                      onInternalNoteChange(
                        event.target.value,
                      )
                    }
                  />
                </label>
                <button
                  type="submit"
                  disabled={!reviewStarted}
                  className={styles.compactButton}
                >
                  Save note
                </button>
              </form>
            </div>
          </Panel>

          <Panel
            title="Recent Collaboration / Audit Trail"
            action={
              <ActionLink href="#audit-trail">
                View Full History
              </ActionLink>
            }
          >
            <ol
              id="audit-trail"
              className={styles.timeline}
            >
              {model.timelineItems.map(
                (item, index) => (
                  <li key={item.id}>
                    <span
                      className={styles.timelineRail}
                      aria-hidden="true"
                    >
                      <span />
                      {index <
                      model.timelineItems.length - 1 ? (
                        <i />
                      ) : null}
                    </span>

                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                    </div>

                    <time dateTime={item.occurredAt}>
                      {item.timestampLabel}
                    </time>
                  </li>
                ),
              )}
            </ol>
          </Panel>
        </div>

        <Panel
          title="Share / Refer Workflow"
          icon={
            <Building2 aria-hidden="true" />
          }
          className={styles.referralPanel}
        >
          <div className={styles.referralBody}>
            {!reviewStarted ? (
              <div className={styles.reviewGate}>
                <div>
                  <strong>
                    Start the officer review
                  </strong>
                  <span>
                    Review actions and departmental referral
                    controls are locked until the review is
                    recorded.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onStartReview}
                  className={styles.primaryButton}
                >
                  Start review
                </button>
              </div>
            ) : null}

            {referralSummary ? (
              <div className={styles.referralSummary}>
                <CheckCircle2 aria-hidden="true" />
                <div>
                  <strong>
                    Referral sent to{" "}
                    {referralSummary.departmentName}
                  </strong>
                  <span>
                    {referralSummary.statusLabel}
                  </span>
                </div>
              </div>
            ) : null}

            <form
              onSubmit={onCreateReferral}
              className={styles.referralForm}
            >
              <div className={styles.formGrid}>
                <label>
                  <FieldLabel required>
                    Share With (Department)
                  </FieldLabel>
                  <select
                    value={referralDepartmentId}
                    disabled={!reviewStarted}
                    onChange={(event) =>
                      onReferralDepartmentChange(
                        event.target.value,
                      )
                    }
                  >
                    {departments.map((department) => (
                      <option
                        key={department.id}
                        value={department.id}
                      >
                        {department.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <FieldLabel required>
                    Officer
                  </FieldLabel>
                  <select
                    value={officerId}
                    disabled={!reviewStarted}
                    onChange={(event) =>
                      onOfficerChange(
                        event.target.value,
                      )
                    }
                  >
                    {filteredOfficers.map((officer) => (
                      <option
                        key={officer.id}
                        value={officer.id}
                      >
                        {officer.name} ({officer.role})
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <FieldLabel required>
                    Reason for Sharing
                  </FieldLabel>
                  <select
                    value={referralReason}
                    disabled={!reviewStarted}
                    onChange={(event) =>
                      onReferralReasonChange(
                        event.target.value,
                      )
                    }
                  >
                    {reasons.map((reason) => (
                      <option
                        key={reason.value}
                        value={reason.value}
                      >
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </label>

                <fieldset
                  className={styles.urgencyField}
                  disabled={!reviewStarted}
                >
                  <legend>
                    <FieldLabel required>
                      Urgency
                    </FieldLabel>
                  </legend>
                  <div className={styles.urgencyOptions}>
                    {(
                      [
                        ["LOW", "Low"],
                        ["NORMAL", "Normal"],
                        ["HIGH", "High"],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        data-selected={
                          urgency === value
                            ? "true"
                            : undefined
                        }
                      >
                        <input
                          type="radio"
                          name="referral-urgency"
                          value={value}
                          checked={urgency === value}
                          onChange={() =>
                            onUrgencyChange(value)
                          }
                        />
                        <span
                          data-tone={value.toLowerCase()}
                          aria-hidden="true"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <label className={styles.messageField}>
                <FieldLabel>
                  Message to Officer
                </FieldLabel>
                <textarea
                  rows={6}
                  maxLength={1000}
                  value={requestedAction}
                  disabled={!reviewStarted}
                  onChange={(event) =>
                    onRequestedActionChange(
                      event.target.value,
                    )
                  }
                />
                <span>
                  {requestedAction.length}/1000
                </span>
              </label>

              <div className={styles.outputGrid}>
                <label>
                  <FieldLabel required>
                    Expected Output
                  </FieldLabel>
                  <input
                    value={expectedOutput}
                    disabled={!reviewStarted}
                    onChange={(event) =>
                      onExpectedOutputChange(
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label>
                  <FieldLabel required>
                    Due Date
                  </FieldLabel>
                  <input
                    type="date"
                    value={dueDate}
                    disabled={!reviewStarted}
                    onChange={(event) =>
                      onDueDateChange(
                        event.target.value,
                      )
                    }
                  />
                </label>
              </div>

              <fieldset
                className={styles.shareFieldset}
                disabled={!reviewStarted}
              >
                <legend>What will be shared</legend>

                <div className={styles.shareGrid}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checklist.application}
                      onChange={(event) =>
                        onChecklistChange(
                          "application",
                          event.target.checked,
                        )
                      }
                    />
                    <span>
                      Application Details (
                      {model.requestId})
                    </span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={shareSelections.notes}
                      onChange={(event) =>
                        onShareSelectionChange(
                          "notes",
                          event.target.checked,
                        )
                      }
                    />
                    <span>Notes & Comments</span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={checklist.identity}
                      onChange={(event) =>
                        onChecklistChange(
                          "identity",
                          event.target.checked,
                        )
                      }
                    />
                    <span>
                      Applicant Profile & Contact Information
                    </span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={shareSelections.sla}
                      onChange={(event) =>
                        onShareSelectionChange(
                          "sla",
                          event.target.checked,
                        )
                      }
                    />
                    <span>
                      SLA & Current Workflow Status
                    </span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={checklist.documents}
                      onChange={(event) =>
                        onChecklistChange(
                          "documents",
                          event.target.checked,
                        )
                      }
                    />
                    <span>
                      Uploaded Documents (
                      {model.availableDocumentCount} files)
                    </span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={shareSelections.audit}
                      onChange={(event) =>
                        onShareSelectionChange(
                          "audit",
                          event.target.checked,
                        )
                      }
                    />
                    <span>
                      Audit Trail / Activity History
                    </span>
                  </label>
                </div>
              </fieldset>

              <div className={styles.informationBanner}>
                <Info aria-hidden="true" />
                <span>
                  The selected officer can view shared
                  information and add comments. Parent ownership
                  remains with {model.parentOwnerLabel}.
                </span>
              </div>

              {correctionOpen ? (
                <div className={styles.correctionPanel}>
                  <div className={styles.correctionHeading}>
                    <div>
                      <strong>
                        Request applicant correction
                      </strong>
                      <span>
                        Applicant instructions remain separate
                        from internal notes.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onCorrectionToggle}
                      className={styles.textButton}
                    >
                      Close
                    </button>
                  </div>

                  <div className={styles.correctionGrid}>
                    <label>
                      <FieldLabel required>
                        Internal reason
                      </FieldLabel>
                      <input
                        value={correctionReason}
                        onChange={(event) =>
                          onCorrectionReasonChange(
                            event.target.value,
                          )
                        }
                      />
                    </label>

                    <label>
                      <FieldLabel required>
                        Applicant-visible instructions
                      </FieldLabel>
                      <textarea
                        rows={3}
                        value={correctionInstructions}
                        onChange={(event) =>
                          onCorrectionInstructionsChange(
                            event.target.value,
                          )
                        }
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      const correctionForm =
                        document.getElementById(
                          "officer-correction-form",
                        ) as HTMLFormElement | null;
                      correctionForm?.requestSubmit();
                    }}
                    className={styles.warningButton}
                  >
                    Send correction request
                  </button>
                </div>
              ) : null}

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={onPreview}
                  disabled={!reviewStarted}
                  className={styles.secondaryButton}
                >
                  <Eye aria-hidden="true" />
                  Share Preview
                </button>

                <button
                  type="button"
                  onClick={onCorrectionToggle}
                  disabled={!reviewStarted}
                  className={styles.secondaryButton}
                >
                  <UserRound aria-hidden="true" />
                  Request Correction
                </button>

                <button
                  type="submit"
                  disabled={
                    !reviewStarted ||
                    !checklistComplete
                  }
                  className={styles.primaryButton}
                >
                  <Send aria-hidden="true" />
                  Send for Review
                </button>
              </div>
            </form>

            {correctionOpen ? (
              <form
                id="officer-correction-form"
                onSubmit={onRequestCorrection}
                className={styles.hiddenCorrectionForm}
                aria-hidden="true"
              >
                <button type="submit">
                  Submit correction
                </button>
              </form>
            ) : null}
          </div>
        </Panel>
      </div>
    </main>
  );
}
