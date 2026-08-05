import type { SupervisorCanonicalHref } from "@/features/demo-engine/navigation/supervisor-navigation-contract";

import styles from "./operational-workspaces.module.css";

export type SupervisorRouteSurfaceView =
  | "department-queue"
  | "unassigned-work"
  | "team-workload"
  | "approval-queue"
  | "escalations"
  | "department-handoffs"
  | "shared-work"
  | "overdue-work"
  | "officer-performance"
  | "department-reports";

type MetricTone = "good" | "warning" | "danger";

type SurfaceMetric = {
  readonly label: string;
  readonly value: string;
  readonly context: string;
  readonly tone?: MetricTone;
};

type SurfaceRecord = {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly owner: string;
  readonly status: string;
  readonly statusTone?: "Overdue" | "Due soon" | "Completed";
};

type SurfaceDefinition = {
  readonly title: string;
  readonly description: string;
  readonly metrics: readonly SurfaceMetric[];
  readonly sectionTitle: string;
  readonly records: readonly SurfaceRecord[];
  readonly insightTitle: string;
  readonly insight: string;
};

const supervisorSurfaces = {
  "department-queue": {
    title: "Department Queue",
    description:
      "Review all active Student Records work while keeping assignment, priority, and SLA exposure visible.",
    metrics: [
      {
        label: "Open work",
        value: "38",
        context: "Across the department queue",
        tone: "good",
      },
      {
        label: "Unassigned",
        value: "7",
        context: "Needs an officer owner",
        tone: "warning",
      },
      {
        label: "Due today",
        value: "9",
        context: "Prioritise before close",
        tone: "warning",
      },
      {
        label: "Overdue",
        value: "4",
        context: "Immediate supervisor action",
        tone: "danger",
      },
    ],
    sectionTitle: "Priority queue",
    records: [
      {
        id: "REQ-2026-0748",
        title: "Transcript Request",
        detail: "Finance verification completed; records review is pending.",
        owner: "Unassigned",
        status: "Due soon",
        statusTone: "Due soon",
      },
      {
        id: "REQ-2026-0739",
        title: "Student Clearance",
        detail: "Library clearance evidence requires departmental review.",
        owner: "Mercy Wanjiku",
        status: "In review",
      },
      {
        id: "REQ-2026-0724",
        title: "Certificate Replacement",
        detail: "Identity evidence was resubmitted by the applicant.",
        owner: "Kevin Mwangi",
        status: "Overdue",
        statusTone: "Overdue",
      },
    ],
    insightTitle: "Queue signal",
    insight:
      "Most current risk is concentrated in unassigned and overdue work rather than new intake volume.",
  },
  "unassigned-work": {
    title: "Unassigned Work",
    description:
      "Assign new departmental work before age, complexity, or service deadlines create avoidable delays.",
    metrics: [
      {
        label: "Unassigned",
        value: "7",
        context: "Awaiting officer ownership",
        tone: "warning",
      },
      {
        label: "Older than 24h",
        value: "3",
        context: "Needs immediate assignment",
        tone: "danger",
      },
      {
        label: "Due today",
        value: "2",
        context: "Assignment affects SLA",
        tone: "warning",
      },
      {
        label: "Available officers",
        value: "5",
        context: "Current active team",
        tone: "good",
      },
    ],
    sectionTitle: "Assignment candidates",
    records: [
      {
        id: "REQ-2026-0752",
        title: "Course Application",
        detail: "Initial completeness review has not started.",
        owner: "Unassigned",
        status: "New",
      },
      {
        id: "REQ-2026-0748",
        title: "Transcript Request",
        detail: "Finance check is complete and records ownership is required.",
        owner: "Unassigned",
        status: "Due soon",
        statusTone: "Due soon",
      },
      {
        id: "REQ-2026-0734",
        title: "Industrial Attachment Letter",
        detail: "Supporting letter and placement evidence are available.",
        owner: "Unassigned",
        status: "Overdue",
        statusTone: "Overdue",
      },
    ],
    insightTitle: "Assignment signal",
    insight:
      "The oldest unassigned work should be distributed before assigning newly submitted requests.",
  },
  "team-workload": {
    title: "Team Workload",
    description:
      "Compare active assignments, overdue exposure, and available capacity across departmental officers.",
    metrics: [
      {
        label: "Active officers",
        value: "5",
        context: "Student Records team",
        tone: "good",
      },
      {
        label: "Open assignments",
        value: "31",
        context: "Excludes unassigned work",
        tone: "good",
      },
      {
        label: "High-load officers",
        value: "2",
        context: "Above the team range",
        tone: "warning",
      },
      {
        label: "Overdue owners",
        value: "3",
        context: "At least one overdue item",
        tone: "danger",
      },
    ],
    sectionTitle: "Officer capacity",
    records: [
      {
        id: "OFF-014",
        title: "Mercy Wanjiku",
        detail: "9 active requests · 2 due today · 1 overdue",
        owner: "Student Records Officer",
        status: "High load",
        statusTone: "Due soon",
      },
      {
        id: "OFF-021",
        title: "Kevin Mwangi",
        detail: "7 active requests · 1 due today · 2 overdue",
        owner: "Records Verification Officer",
        status: "At risk",
        statusTone: "Overdue",
      },
      {
        id: "OFF-026",
        title: "Amina Hassan",
        detail: "4 active requests · 0 due today · 0 overdue",
        owner: "Student Records Officer",
        status: "Available",
        statusTone: "Completed",
      },
    ],
    insightTitle: "Capacity signal",
    insight:
      "Amina has the clearest capacity for reassignment while Kevin carries the highest overdue exposure.",
  },
  "approval-queue": {
    title: "Approval Queue",
    description:
      "Review requests that have completed operational checks and now require a supervisor decision.",
    metrics: [
      {
        label: "Awaiting approval",
        value: "6",
        context: "Ready for decision",
        tone: "warning",
      },
      {
        label: "Due today",
        value: "3",
        context: "Decision deadline today",
        tone: "warning",
      },
      {
        label: "Checks complete",
        value: "6",
        context: "No blocking work items",
        tone: "good",
      },
      {
        label: "Overdue decisions",
        value: "1",
        context: "Supervisor action required",
        tone: "danger",
      },
    ],
    sectionTitle: "Decision-ready requests",
    records: [
      {
        id: "REQ-2026-0718",
        title: "Transcript Request",
        detail: "Records and Finance checks completed successfully.",
        owner: "Mercy Wanjiku",
        status: "Due soon",
        statusTone: "Due soon",
      },
      {
        id: "REQ-2026-0715",
        title: "Student Clearance",
        detail: "All departmental clearance responses are complete.",
        owner: "Kevin Mwangi",
        status: "Ready",
        statusTone: "Completed",
      },
      {
        id: "REQ-2026-0698",
        title: "Certificate Replacement",
        detail: "Replacement justification and identity checks are complete.",
        owner: "Amina Hassan",
        status: "Overdue",
        statusTone: "Overdue",
      },
    ],
    insightTitle: "Approval signal",
    insight:
      "The queue is decision-ready; delay now comes from approval timing rather than incomplete checks.",
  },
  escalations: {
    title: "Escalations",
    description:
      "Resolve requests raised because of delay, policy ambiguity, risk, or an exceeded decision threshold.",
    metrics: [
      {
        label: "Open escalations",
        value: "5",
        context: "Across active services",
        tone: "warning",
      },
      {
        label: "SLA-related",
        value: "3",
        context: "Raised after delay",
        tone: "danger",
      },
      {
        label: "Policy decisions",
        value: "1",
        context: "Needs supervisor direction",
        tone: "warning",
      },
      {
        label: "Resolved this week",
        value: "8",
        context: "Closed with a recorded outcome",
        tone: "good",
      },
    ],
    sectionTitle: "Escalation register",
    records: [
      {
        id: "ESC-2026-0041",
        title: "Transcript Request",
        detail: "Finance response exceeded the agreed handoff deadline.",
        owner: "Escalated by Mercy Wanjiku",
        status: "Overdue",
        statusTone: "Overdue",
      },
      {
        id: "ESC-2026-0038",
        title: "Course Application",
        detail: "Eligibility exception requires supervisor interpretation.",
        owner: "Escalated by Amina Hassan",
        status: "Decision needed",
        statusTone: "Due soon",
      },
      {
        id: "ESC-2026-0035",
        title: "Student Clearance",
        detail: "Repeated departmental return created a workflow loop.",
        owner: "Escalated by Kevin Mwangi",
        status: "In review",
      },
    ],
    insightTitle: "Escalation signal",
    insight:
      "SLA breaches are the dominant escalation source, with one repeated-return loop requiring process correction.",
  },
  "department-handoffs": {
    title: "Department Handoffs",
    description:
      "Track incoming and outgoing referrals, transfers, acceptance times, and cross-department dependencies.",
    metrics: [
      {
        label: "Pending acceptance",
        value: "4",
        context: "Incoming departmental work",
        tone: "warning",
      },
      {
        label: "In progress",
        value: "9",
        context: "Accepted handoffs",
        tone: "good",
      },
      {
        label: "Overdue",
        value: "2",
        context: "Completion deadline passed",
        tone: "danger",
      },
      {
        label: "Completed today",
        value: "6",
        context: "Returned to originators",
        tone: "good",
      },
    ],
    sectionTitle: "Handoff activity",
    records: [
      {
        id: "HND-2026-0112",
        title: "Finance verification",
        detail:
          "Confirm payment reference for Transcript Request REQ-2026-0748.",
        owner: "Finance → Student Records",
        status: "Completed",
        statusTone: "Completed",
      },
      {
        id: "HND-2026-0109",
        title: "Academic status check",
        detail:
          "Department response is awaiting acceptance by Student Records.",
        owner: "Academic Department → Student Records",
        status: "Due soon",
        statusTone: "Due soon",
      },
      {
        id: "HND-2026-0101",
        title: "Clearance confirmation",
        detail: "Library completion result has not returned to the originator.",
        owner: "Student Records → Library",
        status: "Overdue",
        statusTone: "Overdue",
      },
    ],
    insightTitle: "Handoff signal",
    insight:
      "Acceptance is generally healthy; two completion delays are now contributing directly to parent-request age.",
  },
  "shared-work": {
    title: "Shared Work",
    description:
      "See work shared within the department, review invitations received, and requests awaiting collaborative input.",
    metrics: [
      {
        label: "Shared with team",
        value: "11",
        context: "Active collaborative records",
        tone: "good",
      },
      {
        label: "Invitations received",
        value: "4",
        context: "Awaiting a response",
        tone: "warning",
      },
      {
        label: "Feedback requested",
        value: "3",
        context: "Officer input pending",
        tone: "warning",
      },
      {
        label: "Completed reviews",
        value: "7",
        context: "This week",
        tone: "good",
      },
    ],
    sectionTitle: "Collaboration activity",
    records: [
      {
        id: "SHR-2026-0068",
        title: "Transcript Request review",
        detail: "Mercy requested a second review of academic record matching.",
        owner: "Shared with Kevin Mwangi",
        status: "Due soon",
        statusTone: "Due soon",
      },
      {
        id: "SHR-2026-0064",
        title: "Clearance exception feedback",
        detail: "Amina was invited to comment on a missing library response.",
        owner: "Shared by Supervisor",
        status: "In review",
      },
      {
        id: "SHR-2026-0059",
        title: "Certificate replacement evidence",
        detail: "Peer review was completed and returned to the owning officer.",
        owner: "Shared with Mercy Wanjiku",
        status: "Completed",
        statusTone: "Completed",
      },
    ],
    insightTitle: "Collaboration signal",
    insight:
      "Second-review requests are being completed, but four invitations still need an explicit response.",
  },
  "overdue-work": {
    title: "Overdue Work",
    description:
      "Prioritise departmental work whose request, work-item, approval, or handoff deadline has passed.",
    metrics: [
      {
        label: "Overdue items",
        value: "9",
        context: "Across all work types",
        tone: "danger",
      },
      {
        label: "Older than 48h",
        value: "4",
        context: "Highest recovery priority",
        tone: "danger",
      },
      {
        label: "Awaiting department",
        value: "3",
        context: "External dependency delay",
        tone: "warning",
      },
      {
        label: "Assigned internally",
        value: "6",
        context: "Directly recoverable by team",
        tone: "warning",
      },
    ],
    sectionTitle: "Recovery queue",
    records: [
      {
        id: "REQ-2026-0698",
        title: "Certificate Replacement",
        detail: "Supervisor decision is 18 hours beyond its deadline.",
        owner: "Amina Hassan",
        status: "Overdue",
        statusTone: "Overdue",
      },
      {
        id: "HND-2026-0101",
        title: "Library clearance handoff",
        detail: "Completion result is 11 hours late.",
        owner: "Library dependency",
        status: "Overdue",
        statusTone: "Overdue",
      },
      {
        id: "REQ-2026-0724",
        title: "Transcript Request",
        detail: "Document review is 7 hours beyond its work-item SLA.",
        owner: "Kevin Mwangi",
        status: "Overdue",
        statusTone: "Overdue",
      },
    ],
    insightTitle: "Recovery signal",
    insight:
      "Four older items should be recovered first; six overdue records remain within direct departmental control.",
  },
  "officer-performance": {
    title: "Officer Performance",
    description:
      "Review balanced officer performance using throughput, handling time, workload, and SLA compliance together.",
    metrics: [
      {
        label: "Team SLA compliance",
        value: "91%",
        context: "Current reporting period",
        tone: "good",
      },
      {
        label: "Median handling time",
        value: "6.2h",
        context: "Across completed work items",
        tone: "good",
      },
      {
        label: "Completed this week",
        value: "47",
        context: "Department total",
        tone: "good",
      },
      {
        label: "Reassignment rate",
        value: "8%",
        context: "Requires context, not ranking",
        tone: "warning",
      },
    ],
    sectionTitle: "Officer performance summary",
    records: [
      {
        id: "OFF-014",
        title: "Mercy Wanjiku",
        detail: "14 completed · 94% on time · 5.8h median handling",
        owner: "9 active assignments",
        status: "On track",
        statusTone: "Completed",
      },
      {
        id: "OFF-021",
        title: "Kevin Mwangi",
        detail: "11 completed · 82% on time · 7.4h median handling",
        owner: "7 active assignments",
        status: "Needs review",
        statusTone: "Due soon",
      },
      {
        id: "OFF-026",
        title: "Amina Hassan",
        detail: "12 completed · 96% on time · 5.5h median handling",
        owner: "4 active assignments",
        status: "On track",
        statusTone: "Completed",
      },
    ],
    insightTitle: "Performance signal",
    insight:
      "Kevin's lower compliance should be reviewed alongside his higher overdue workload rather than raw completion counts alone.",
  },
  "department-reports": {
    title: "Department Reports",
    description:
      "Review departmental volume, completion, SLA, handoff, and workload indicators from one supervisor-owned route.",
    metrics: [
      {
        label: "Requests received",
        value: "126",
        context: "Current month",
        tone: "good",
      },
      {
        label: "Completion rate",
        value: "88%",
        context: "Completed versus received",
        tone: "good",
      },
      {
        label: "Median turnaround",
        value: "2.4d",
        context: "Across completed requests",
        tone: "good",
      },
      {
        label: "SLA breaches",
        value: "9",
        context: "Current reporting period",
        tone: "danger",
      },
    ],
    sectionTitle: "Available report views",
    records: [
      {
        id: "RPT-VOLUME",
        title: "Service volume and completion",
        detail: "Requests received, completed, open, and returned by service.",
        owner: "Updated from operational fixtures",
        status: "Available",
        statusTone: "Completed",
      },
      {
        id: "RPT-SLA",
        title: "SLA and turnaround",
        detail: "Compliance, breach age, queue waiting, and processing time.",
        owner: "Department scope",
        status: "Available",
        statusTone: "Completed",
      },
      {
        id: "RPT-HANDOFF",
        title: "Department handoff performance",
        detail: "Acceptance, completion, overdue rate, and common routes.",
        owner: "Department scope",
        status: "Available",
        statusTone: "Completed",
      },
    ],
    insightTitle: "Reporting signal",
    insight:
      "Service completion remains healthy, but nine SLA breaches require route and workload analysis rather than a volume-only view.",
  },
} as const satisfies Record<SupervisorRouteSurfaceView, SurfaceDefinition>;

export function SupervisorRouteSurface({
  canonicalHref,
  view,
}: {
  readonly canonicalHref: SupervisorCanonicalHref;
  readonly view: SupervisorRouteSurfaceView;
}) {
  const surface: SurfaceDefinition = supervisorSurfaces[view];

  return (
    <main
      className={styles.workspace}
      data-supervisor-route={canonicalHref}
      data-supervisor-surface={view}
    >
      <header className={styles.pageHeader}>
        <div>
          <h1>{surface.title}</h1>
          <p>{surface.description}</p>
        </div>
      </header>

      <section
        className={styles.metricGrid}
        aria-label={`${surface.title} metrics`}
      >
        {surface.metrics.map((metric) => (
          <article
            className={styles.metricCard}
            data-tone={metric.tone}
            key={metric.label}
          >
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.context}</small>
          </article>
        ))}
      </section>

      <section className={styles.tasksLayout}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>{surface.sectionTitle}</h2>
          </div>

          <div className={styles.caseWorkspace}>
            {surface.records.map((record) => (
              <article className={styles.miniCard} key={record.id}>
                <div className={styles.inlineActions}>
                  <strong>{record.id}</strong>
                  <span
                    className={styles.statusBadge}
                    data-status={record.statusTone}
                  >
                    {record.status}
                  </span>
                </div>
                <h3>{record.title}</h3>
                <p>{record.detail}</p>
                <small>{record.owner}</small>
              </article>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>{surface.insightTitle}</h2>
          </div>
          <div className={styles.caseWorkspace}>
            <article className={styles.miniCard}>
              <h3>Supervisor interpretation</h3>
              <p>{surface.insight}</p>
            </article>
            <article className={styles.miniCard}>
              <h3>Route ownership</h3>
              <p>
                This body is rendered beneath the persistent supervisor layout
                and does not mount another sidebar or top bar.
              </p>
            </article>
          </div>
        </article>
      </section>
    </main>
  );
}
