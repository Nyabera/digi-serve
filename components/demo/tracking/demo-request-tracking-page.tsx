"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Database,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import styles from "./demo-request-tracking-page.module.css";

type DemoRequestTrackingPageProps = {
  requestId: string;
};

type StageState = "complete" | "current" | "pending";

type ProcessingStage = {
  title: string;
  publicDescription: string;
  backendEvent: string;
  timestamp: string;
  completion: number;
};

const PROCESSING_STAGES: ProcessingStage[] = [
  {
    title: "Request submitted",
    publicDescription:
      "Your request and selected-document metadata were received.",
    backendEvent:
      "request.created · applicant payload validated · audit entry recorded",
    timestamp: "09:12",
    completion: 12,
  },
  {
    title: "Student Records review",
    publicDescription:
      "Student Records is checking the request details and academic record.",
    backendEvent:
      "records.review.started · transcript requirements loaded · identity match queued",
    timestamp: "09:18",
    completion: 34,
  },
  {
    title: "Finance verification",
    publicDescription:
      "Finance is checking whether an institutional hold blocks processing.",
    backendEvent:
      "finance.verification.started · account status checked · clearance result pending",
    timestamp: "09:26",
    completion: 58,
  },
  {
    title: "Registrar approval",
    publicDescription:
      "The Registrar is reviewing the verified request for final approval.",
    backendEvent:
      "registrar.approval.started · prerequisites confirmed · outcome generation queued",
    timestamp: "09:41",
    completion: 82,
  },
  {
    title: "Transcript ready",
    publicDescription:
      "The controlled demo transcript is ready for download or collection.",
    backendEvent:
      "outcome.issued · transcript generated · applicant notification recorded",
    timestamp: "09:55",
    completion: 100,
  },
];

const STAGE_TIMING = [
  { stage: "Submitted", completion: 12 },
  { stage: "Records", completion: 34 },
  { stage: "Finance", completion: 58 },
  { stage: "Registrar", completion: 82 },
  { stage: "Ready", completion: 100 },
];

function getStageState(index: number, activeStage: number): StageState {
  if (index < activeStage) return "complete";
  if (index === activeStage) return "current";
  return "pending";
}

export function DemoRequestTrackingPage({
  requestId,
}: DemoRequestTrackingPageProps) {
  const [activeStage, setActiveStage] = useState(1);
  const [isRunning, setIsRunning] = useState(true);

  const safeRequestId = requestId.trim() || "REQ-DEMO-001";
  const currentStage = PROCESSING_STAGES[activeStage];
  const progress = currentStage.completion;
  const isComplete = activeStage === PROCESSING_STAGES.length - 1;

  useEffect(() => {
    if (!isRunning || isComplete) return;

    const timer = window.setTimeout(() => {
      setActiveStage((current) =>
        Math.min(current + 1, PROCESSING_STAGES.length - 1),
      );
    }, 6500);

    return () => window.clearTimeout(timer);
  }, [activeStage, isComplete, isRunning]);

  const visibleEvents = useMemo(
    () =>
      PROCESSING_STAGES.slice(0, activeStage + 1).map((stage, index) => ({
        ...stage,
        state: getStageState(index, activeStage),
      })),
    [activeStage],
  );

  function advanceDemo() {
    setActiveStage((current) =>
      Math.min(current + 1, PROCESSING_STAGES.length - 1),
    );
  }

  function restartDemo() {
    setActiveStage(0);
    setIsRunning(true);
  }

  return (
    <main
      className={`${styles.page} demo-surface-light`}
      aria-labelledby="tracking-page-title"
    >
      <section className={`${styles.hero} demo-surface-dark`}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Savannah Technical College</p>
            <h1 id="tracking-page-title">Track your request</h1>
            <p>
              Follow the applicant-safe progress while the demo engine
              simulates Student Records, Finance and Registrar processing.
            </p>
          </div>

          <div className={styles.heroSummary} aria-label="Request summary">
            <div>
              <span>Request ID</span>
              <strong>{safeRequestId}</strong>
            </div>
            <div>
              <span>Service</span>
              <strong>Academic transcript request</strong>
            </div>
            <div>
              <span>Current stage</span>
              <strong>{currentStage.title}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.content}>
        <section className={styles.progressCard} aria-labelledby="progress-title">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Live demo progress</p>
              <h2 id="progress-title">Request processing</h2>
            </div>
            <span className={styles.demoBadge}>Simulated backend activity</span>
          </div>

          <div className={styles.progressSummary}>
            <div>
              <strong>{progress}%</strong>
              <span>{currentStage.title}</span>
            </div>
            <p>{currentStage.publicDescription}</p>
          </div>

          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-label="Request processing progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-valuetext={`${progress}% complete — ${currentStage.title}`}
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <ol className={styles.stageGrid} aria-label="Request stages">
            {PROCESSING_STAGES.map((stage, index) => {
              const state = getStageState(index, activeStage);

              return (
                <li
                  key={stage.title}
                  className={styles.stage}
                  data-state={state}
                >
                  <span className={styles.stageMarker} aria-hidden="true">
                    {state === "complete" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div>
                    <strong>{stage.title}</strong>
                    <span>
                      {state === "complete"
                        ? "Complete"
                        : state === "current"
                          ? "In progress"
                          : "Pending"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <div className={styles.dashboardGrid}>
          <section className={styles.chartCard} aria-labelledby="chart-title">
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionEyebrow}>Processing chart</p>
                <h2 id="chart-title">Backend completion path</h2>
              </div>
            </div>

            <p className={styles.chartIntro}>
              The chart shows the seeded completion percentage for each office
              in the transcript workflow.
            </p>

            <div className={styles.chartFrame}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={STAGE_TIMING.slice(0, activeStage + 1)}
                  margin={{ top: 12, right: 18, left: -12, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="stage" tickLine={false} axisLine={false} />
                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="completion"
                    name="Completion"
                    unit="%"
                    stroke="currentColor"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className={styles.activityCard} aria-labelledby="activity-title">
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionEyebrow}>Backend activity</p>
                <h2 id="activity-title">What the demo engine is doing</h2>
              </div>
            </div>

            <div className={styles.activityList} role="status" aria-live="polite">
              {visibleEvents.map((event) => (
                <article key={event.title} className={styles.activityItem}>
                  <span className={styles.activityIcon} aria-hidden="true">
                    {event.state === "complete" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Database size={18} />
                    )}
                  </span>
                  <div>
                    <div className={styles.activityTitleRow}>
                      <strong>{event.title}</strong>
                      <time>{event.timestamp}</time>
                    </div>
                    <p>{event.backendEvent}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className={styles.statusGrid} aria-label="Request safeguards">
          <article>
            <Clock3 aria-hidden="true" />
            <div>
              <span>Estimated demo duration</span>
              <strong>About 30 seconds</strong>
            </div>
          </article>
          <article>
            <ShieldCheck aria-hidden="true" />
            <div>
              <span>Data handling</span>
              <strong>Browser-session simulation only</strong>
            </div>
          </article>
          <article>
            <FileCheck2 aria-hidden="true" />
            <div>
              <span>Outcome</span>
              <strong>
                {isComplete ? "Transcript ready" : "Processing in progress"}
              </strong>
            </div>
          </article>
        </section>

        <section className={styles.controlsCard} aria-labelledby="controls-title">
          <div>
            <p className={styles.sectionEyebrow}>Presentation controls</p>
            <h2 id="controls-title">Control the tracking demonstration</h2>
            <p>
              Let the request progress automatically or move it forward
              manually while presenting the workflow.
            </p>
          </div>

          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={advanceDemo}
              disabled={isComplete}
            >
              {isComplete ? "Processing complete" : "Advance demo"}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setIsRunning((current) => !current)}
              disabled={isComplete}
            >
              {isRunning ? "Pause simulation" : "Resume simulation"}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={restartDemo}
            >
              Restart demo
            </button>
          </div>
        </section>

        <div className={styles.footerActions}>
          <Link href="/demo" className={styles.textLink}>
            Back to student services
          </Link>
          {isComplete ? (
            <Link
              href={`/demo/outcomes/${encodeURIComponent(safeRequestId)}`}
              className={styles.outcomeButton}
            >
              View demo outcome
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
