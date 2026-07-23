"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileText,
  Inbox,
  RefreshCcw,
  TimerReset,
  XCircle,
} from "lucide-react";
import type { FormEventHandler } from "react";

import type {
  DepartmentHandoffResult,
  DepartmentProcessingModel,
} from "@/features/department-handoffs/model/department-handoff-model";

import styles from "./department-handoff-workspace.module.css";

type Props = {
  readonly model: DepartmentProcessingModel;
  readonly selectedResult: DepartmentHandoffResult;
  readonly resultNote: string;
  readonly feedbackMessage: string | null;
  readonly errorMessage: string | null;
  readonly onAccept: () => void;
  readonly onResultChange: (value: DepartmentHandoffResult) => void;
  readonly onResultNoteChange: (value: string) => void;
  readonly onComplete: FormEventHandler<HTMLFormElement>;
  readonly onReturnForClarification: () => void;
  readonly onDecline: () => void;
};

export function DepartmentProcessingBody(props: Props) {
  const { model, selectedResult, resultNote, feedbackMessage, errorMessage } = props;
  const handoff = model.handoff;
  const pending = handoff.status === "PENDING_ACCEPTANCE";
  const canProcess = handoff.status === "IN_PROGRESS";
  const completed = handoff.status === "COMPLETED";

  return (
    <main className={styles.workspace} data-d29r5-department-processing="true">
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/demo/department">Finance Workspace</Link>
        <ChevronRight aria-hidden="true" />
        <Link href="/demo/department">Handoff Inbox</Link>
        <ChevronRight aria-hidden="true" />
        <strong>{handoff.id}</strong>
      </nav>

      <header className={styles.processingHeader}>
        <div>
          <h1>Finance verification</h1>
          <p>Process the departmental work item and return a controlled result to {model.parentOwnerName}.</p>
        </div>
        <Link href="/demo/department" className={styles.compactButton}>
          <ArrowLeft aria-hidden="true" /> Officer queue
        </Link>
      </header>

      {feedbackMessage ? (
        <div role="status" className={styles.feedbackBanner}>
          <CheckCircle2 aria-hidden="true" /><span>{feedbackMessage}</span>
        </div>
      ) : null}
      {errorMessage ? (
        <div role="alert" className={styles.errorBanner}>
          <CircleAlert aria-hidden="true" /><span>{errorMessage}</span>
        </div>
      ) : null}

      <section className={styles.metricGrid} aria-label="Handoff processing metrics">
        {[
          { label: "Pending acceptance", value: pending ? 1 : 0, tone: "orange", icon: Inbox },
          { label: "In progress", value: canProcess ? 1 : 0, tone: "green", icon: TimerReset },
          { label: "Returned", value: handoff.status === "RETURNED_FOR_CLARIFICATION" ? 1 : 0, tone: "purple", icon: RefreshCcw },
          { label: "Completed", value: completed ? 1 : 0, tone: "blue", icon: CheckCircle2 },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className={styles.metricCard} data-tone={metric.tone}>
              <span className={styles.metricIcon} aria-hidden="true"><Icon /></span>
              <div className={styles.metricCopy}><span>{metric.label}</span><strong>{metric.value}</strong></div>
            </article>
          );
        })}
      </section>

      <div className={styles.processingGrid}>
        <div className={styles.rightStack}>
          <section className={styles.panel}>
            <header className={styles.panelHeader}>
              <div><h2>{handoff.requestTitle}</h2><p className="text-reference">{handoff.id} · {handoff.requestId}</p></div>
              <span className={styles.statusBadge} data-tone={handoff.statusTone}>{handoff.statusLabel}</span>
            </header>
            <div className={styles.requestSummary}>
              <div className={styles.requestHero}>
                <div><strong>{handoff.requestTitle}</strong><span>Applicant: {handoff.applicantName}</span></div>
                <Link href={`/demo/officer/requests/${handoff.requestId}`} className={styles.actionLink}>Parent request <ArrowRight aria-hidden="true" /></Link>
              </div>
              <dl className={styles.summaryGrid}>
                <div className={styles.summaryCard}><dt>Parent owner</dt><dd>{model.parentOwnerName}</dd><p>Ownership does not transfer to Finance.</p></div>
                <div className={styles.summaryCard}><dt>Receiving department</dt><dd>{model.receivingDepartmentName}</dd><p>Officer: {model.receivingOfficerName}</p></div>
                <div className={styles.summaryCard}><dt>Due date</dt><dd>{handoff.dueDateLabel}</dd><p>{handoff.dueStateLabel}</p></div>
                <div className={styles.summaryCard}><dt>Expected output</dt><dd>{handoff.expectedOutput}</dd></div>
              </dl>
              <div className={styles.requestActionCard}><strong>Requested action</strong><p>{handoff.requestedAction}</p></div>
              <div className={styles.requestActionCard}><strong>Reason for handoff</strong><p>{handoff.reason}</p></div>
              {handoff.documents.length ? (
                <ul className={styles.documentList}>
                  {handoff.documents.map((document) => (
                    <li key={document.id}><div className={styles.documentLink}><span><FileText aria-hidden="true" /><span><strong>{document.name}</strong><small>{document.summary}</small></span></span><span className={styles.actionLink}>View</span></div></li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>

          <section className={styles.panel}>
            <header className={styles.panelHeader}><div><h2>Handoff timeline</h2><p>Human-readable departmental history.</p></div></header>
            <ol className={`${styles.timelineList} ${styles.requestSummary}`}>
              {handoff.timeline.map((item, index) => (
                <li key={item.id} className={styles.timelineItem}>
                  <span className={styles.timelineRail} aria-hidden="true"><span />{index < handoff.timeline.length - 1 ? <i /> : null}</span>
                  <div><strong>{item.title}</strong><p>{item.detail}</p></div>
                  <time dateTime={item.occurredAt}>{item.timestampLabel}</time>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className={`${styles.panel} ${styles.resultPanel}`}>
          <header className={styles.panelHeader}><div><h2>Record Finance result</h2><p>Return one controlled result to the parent request owner.</p></div></header>
          <form onSubmit={props.onComplete} className={styles.resultForm}>
            {pending ? (
              <button type="button" onClick={props.onAccept} className={styles.primaryButton}><CheckCircle2 aria-hidden="true" />Accept handoff</button>
            ) : null}

            {completed ? (
              <div className={styles.completedResult}>
                <strong>Finance result returned: {model.result}</strong>
                <p>{model.resultNote || "The Finance work item was completed and returned."}</p>
                {model.completedAtLabel ? <p>Completed {model.completedAtLabel}</p> : null}
              </div>
            ) : (
              <>
                <fieldset className={styles.resultOptions} disabled={!canProcess}>
                  <legend className="sr-only">Finance result</legend>
                  {(["CLEAR", "HOLD", "CANNOT_VERIFY"] as const).map((result) => (
                    <label key={result} className={styles.resultOption} data-selected={selectedResult === result ? "true" : undefined}>
                      <input type="radio" name="finance-result" value={result} checked={selectedResult === result} onChange={() => props.onResultChange(result)} />
                      {result.replaceAll("_", " ")}
                    </label>
                  ))}
                </fieldset>
                <label>
                  Finance note
                  <textarea required disabled={!canProcess} value={resultNote} onChange={(event) => props.onResultNoteChange(event.target.value)} placeholder="Record the evidence reviewed and the reason for the result." />
                </label>
                <div className={styles.resultFooter}>
                  <button type="submit" disabled={!canProcess} className={styles.primaryButton}>Complete and return <ArrowRight aria-hidden="true" /></button>
                  <button type="button" disabled={!canProcess} onClick={props.onReturnForClarification} className={styles.secondaryButton}><RefreshCcw aria-hidden="true" />Return for clarification</button>
                  <button type="button" disabled={!canProcess} onClick={props.onDecline} className={styles.dangerButton}><XCircle aria-hidden="true" />Decline handoff</button>
                </div>
              </>
            )}
          </form>
        </aside>
      </div>
    </main>
  );
}
