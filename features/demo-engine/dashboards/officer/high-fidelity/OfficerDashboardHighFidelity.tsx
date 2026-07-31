"use client";

import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleAlert,
  CircleHelp,
  ClipboardList,
  Clock3,
  EllipsisVertical,
  FileBarChart,
  FileText,
  ListChecks,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
  UserRoundCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import "./officer-dashboard-reference.css";

type Accent = "blue" | "orange" | "red" | "green" | "violet";
type PlanTab = "Needs action" | "Waiting on others" | "Ready to complete";

export type OfficerDashboardProps = {
  /** Keep true when the dashboard renders inside the existing sidebar/topbar shell. */
  embedded?: boolean;
};

type WorkItem = {
  service: string;
  applicant: string;
  requestId: string;
  nextAction: string;
  stage: string;
  sla: string;
  status: string;
  action: string;
  accent: Accent;
  icon: LucideIcon;
  tab: PlanTab;
};

type SignalItem = {
  title: string;
  meta: string;
  note?: string;
  time: string;
  action: string;
  accent: Accent;
  icon: LucideIcon;
  tag?: string;
};

const workItems: WorkItem[] = [
  {
    service: "Transcript Request",
    applicant: "Brian Otieno",
    requestId: "REQ-2026-0715",
    nextAction: "Review overdue documents and confirm eligibility.",
    stage: "Records review",
    sla: "Overdue 2d",
    status: "Overdue",
    action: "Review",
    accent: "violet",
    icon: FileText,
    tab: "Needs action",
  },
  {
    service: "Certificate Replacement",
    applicant: "Mercy Akinyi",
    requestId: "REQ-2026-0718",
    nextAction: "Verify payment reference and confirm documents.",
    stage: "Finance verification",
    sla: "Due today",
    status: "Due today",
    action: "Check",
    accent: "orange",
    icon: FileText,
    tab: "Needs action",
  },
  {
    service: "Clearance Letter",
    applicant: "Kevin Mwangi",
    requestId: "REQ-2026-0722",
    nextAction: "Review resubmitted document and make a decision.",
    stage: "Records review",
    sla: "Due in 2d",
    status: "Due soon",
    action: "Review",
    accent: "green",
    icon: ShieldCheck,
    tab: "Needs action",
  },
  {
    service: "Grade Review",
    applicant: "Linda Njeri",
    requestId: "REQ-2026-0726",
    nextAction: "Waiting on Registrar Office to complete verification.",
    stage: "Registrar approval",
    sla: "Due in 5d",
    status: "Waiting",
    action: "Monitor",
    accent: "blue",
    icon: FileBarChart,
    tab: "Waiting on others",
  },
  {
    service: "Course Registration",
    applicant: "Daniel Kiptoo",
    requestId: "REQ-2026-0728",
    nextAction: "Waiting on Finance Office to confirm payment.",
    stage: "Finance verification",
    sla: "Due in 6d",
    status: "Waiting",
    action: "Monitor",
    accent: "orange",
    icon: FileText,
    tab: "Waiting on others",
  },
  {
    service: "To Finance Office",
    applicant: "Grace Wanjiru",
    requestId: "REQ-2026-0711",
    nextAction: "Handoff sent for payment confirmation.",
    stage: "Finance verification",
    sla: "Due in 6d",
    status: "Waiting",
    action: "View",
    accent: "violet",
    icon: RefreshCw,
    tab: "Waiting on others",
  },
  {
    service: "Student ID Renewal",
    applicant: "Aisha Noor",
    requestId: "REQ-2026-0694",
    nextAction: "Final document is ready to issue.",
    stage: "Output ready",
    sla: "On track",
    status: "Ready",
    action: "Complete",
    accent: "green",
    icon: CheckCircle2,
    tab: "Ready to complete",
  },
  {
    service: "Enrollment Letter",
    applicant: "John Kamau",
    requestId: "REQ-2026-0702",
    nextAction: "Applicant notification is ready to send.",
    stage: "Output ready",
    sla: "On track",
    status: "Ready",
    action: "Complete",
    accent: "blue",
    icon: CheckCircle2,
    tab: "Ready to complete",
  },
];

const planTabs: Record<PlanTab, { count: number; icon: LucideIcon }> = {
  "Needs action": { count: 3, icon: ClipboardList },
  "Waiting on others": { count: 3, icon: UsersRound },
  "Ready to complete": { count: 2, icon: CheckCircle2 },
};

const caseSignals: SignalItem[] = [
  {
    title: "I have attached the payment receipt for your review.",
    meta: "Certificate Replacement   •   REQ-2026-0718",
    time: "9:28 AM",
    action: "Reply",
    accent: "orange",
    icon: CircleAlert,
  },
  {
    title: "From Admissions Office",
    meta: "Transcript Request   •   REQ-2026-0709",
    note: "Please review documents and confirm eligibility.",
    time: "9:12 AM",
    action: "View case",
    accent: "green",
    icon: ArrowUp,
    tag: "Handoff",
  },
  {
    title: "To Finance Office",
    meta: "Certificate Replacement   •   REQ-2026-0718",
    note: "Sent for payment verification.",
    time: "Yesterday",
    action: "View handoff",
    accent: "blue",
    icon: ArrowUp,
    tag: "Handoff sent",
  },
];

const handoffs = [
  { title: "From Admissions Office", meta: "Transcript Request   •   REQ-2026-0709", time: "9:12 AM", icon: ArrowDown, accent: "green" as Accent },
  { title: "To Finance Office", meta: "Certificate Replacement   •   REQ-2026-0718", time: "8:45 AM", icon: ArrowUp, accent: "blue" as Accent },
  { title: "Completed to Applicant", meta: "Clearance Letter   •   REQ-2026-0698", time: "Yesterday", icon: CheckCircle2, accent: "green" as Accent },
];

const activities = [
  { time: "9:35 AM", title: "Assigned Transcript Request to you", meta: "REQ-2026-0715   •   Brian Otieno", icon: UserRound, accent: "blue" as Accent },
  { time: "9:12 AM", title: "Status changed to Finance verification", meta: "REQ-2026-0718   •   Daniel Kiptoo", icon: Clock3, accent: "orange" as Accent },
  { time: "8:45 AM", title: "Payment receipt", meta: "Certificate Replacement   •   REQ-2026-0718", icon: ArrowUp, accent: "blue" as Accent },
  { time: "8:15 AM", title: "Decision recorded", meta: "Approved   •   REQ-2026-0703", icon: CheckCircle2, accent: "green" as Accent },
];

const upNext = [
  { service: "Transcript Request", id: "REQ-2026-0715", due: "Overdue 2d", accent: "violet" as Accent, icon: FileText },
  { service: "Certificate Replacement", id: "REQ-2026-0718", due: "Due today", accent: "orange" as Accent, icon: FileText },
  { service: "Clearance Letter", id: "REQ-2026-0722", due: "Due in 2d", accent: "green" as Accent, icon: ShieldCheck },
  { service: "Grade Review", id: "REQ-2026-0726", due: "Due in 5d", accent: "blue" as Accent, icon: FileBarChart },
];

const actions = [
  { label: "Documents awaiting review", count: 3, accent: "violet" as Accent, icon: FileText },
  { label: "Referral acceptance", count: 2, accent: "green" as Accent, icon: UserRoundCheck },
  { label: "Clarification received", count: 1, accent: "blue" as Accent, icon: CircleHelp },
  { label: "Decision pending", count: 2, accent: "orange" as Accent, icon: Clock3 },
  { label: "Unread messages", count: 5, accent: "violet" as Accent, icon: Mail },
];

const chartSeries: Record<string, { labels: string[]; workload: number[]; completions: number[] }> = {
  "Last 7 days": {
    labels: ["May 2", "May 3", "May 4", "May 5", "May 6", "May 7", "May 8"],
    workload: [13, 19, 24, 20, 21, 17, 12],
    completions: [7, 11, 14, 11, 11.5, 11, 7],
  },
  "Last 14 days": {
    labels: ["Apr 25", "Apr 27", "Apr 29", "May 1", "May 3", "May 5", "May 8"],
    workload: [10, 15, 18, 16, 22, 19, 14],
    completions: [6, 8, 12, 10, 13, 12, 8],
  },
  "Last 30 days": {
    labels: ["Apr 9", "Apr 14", "Apr 19", "Apr 24", "Apr 29", "May 4", "May 8"],
    workload: [14, 17, 21, 18, 23, 22, 13],
    completions: [8, 10, 13, 11, 14, 13, 8],
  },
};

function TextButton({ children, onClick, className = "" }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return <button type="button" className={`text-button ${className}`} onClick={onClick}>{children}</button>;
}

function IconBadge({ icon: Icon, accent, small = false }: { icon: LucideIcon; accent: Accent; small?: boolean }) {
  return <span className={`icon-badge icon-badge--${accent}${small ? " icon-badge--small" : ""}`} aria-hidden="true"><Icon strokeWidth={2.15} /></span>;
}

function SectionHeading({ id, icon: Icon, children, action }: { id: string; icon: LucideIcon; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="section-heading">
      <span className="section-heading__icon" aria-hidden="true"><Icon strokeWidth={2.1} /></span>
      <h2 id={id}>{children}</h2>
      {action && <div className="section-heading__action">{action}</div>}
    </div>
  );
}

function RequestId({ value }: { value: string }) {
  const splitAt = value.lastIndexOf("-");
  if (splitAt < 0) return <span className="request-id">{value}</span>;
  return (
    <span className="request-id" aria-label={value}>
      <span aria-hidden="true">{value.slice(0, splitAt + 1)}</span>
      <span aria-hidden="true">{value.slice(splitAt + 1)}</span>
    </span>
  );
}

function WorkPlan({ notify }: { notify: (message: string) => void }) {
  const [activeTab, setActiveTab] = useState<PlanTab>("Needs action");
  const selected = useMemo(() => {
    const primary = workItems.filter((item) => item.tab === activeTab);
    const remaining = workItems.filter((item) => item.tab !== activeTab);
    return [...primary, ...remaining].slice(0, 6);
  }, [activeTab]);

  return (
    <section className="work-plan" aria-labelledby="plan-title">
      <h2 className="sr-only" id="plan-title">Today&apos;s work plan</h2>
      <div className="plan-tabs" role="tablist" aria-label="Work plan filters">
        {(Object.keys(planTabs) as PlanTab[]).map((tab) => {
          const Icon = planTabs[tab].icon;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={activeTab === tab ? "is-active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              <Icon aria-hidden="true" strokeWidth={2.05} />
              <span className="plan-tab-label">{tab}</span>
              <span className="plan-tab-count">{planTabs[tab].count}</span>
            </button>
          );
        })}
      </div>

      <div className="work-table-wrap">
        <table className="work-table">
          <colgroup>
            <col className="col-service" />
            <col className="col-applicant" />
            <col className="col-request" />
            <col className="col-next" />
            <col className="col-stage" />
            <col className="col-sla" />
            <col className="col-status" />
            <col className="col-action" />
          </colgroup>
          <thead>
            <tr>
              <th>Service</th><th>Applicant</th><th>Request ID</th><th>Next action</th><th>Stage</th><th>SLA</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {selected.map((item) => {
              const Icon = item.icon;
              return (
                <tr key={item.requestId} className={`row-accent--${item.accent}`}>
                  <td data-label="Service">
                    <div className="service-cell">
                      <span className={`service-icon service-icon--${item.accent}`} aria-hidden="true"><Icon strokeWidth={2.25} /></span>
                      <strong>{item.service}</strong>
                    </div>
                  </td>
                  <td data-label="Applicant">{item.applicant}</td>
                  <td data-label="Request ID"><RequestId value={item.requestId} /></td>
                  <td data-label="Next action" className="next-action-copy" title={item.nextAction}>{item.nextAction}</td>
                  <td data-label="Stage">{item.stage}</td>
                  <td data-label="SLA">
                    <div className="sla-cell">
                      <span className={`sla-line sla-line--${item.accent}`}><i /></span>
                      <span className={`sla-text--${item.accent}`}>{item.sla}</span>
                    </div>
                  </td>
                  <td data-label="Status"><span className={`status status--${item.accent}`}>{item.status}</span></td>
                  <td data-label="Action">
                    <div className="row-actions">
                      <TextButton onClick={() => notify(`${item.action}: ${item.service}`)}>{item.action}</TextButton>
                      <button className="row-menu" type="button" aria-label={`More actions for ${item.service}`} onClick={() => notify(`More actions: ${item.service}`)}><EllipsisVertical /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CaseSignals({ notify }: { notify: (message: string) => void }) {
  return (
    <section className="card signals-card" aria-labelledby="signals-title">
      <div className="signals-heading">
        <h2 id="signals-title">Case signals</h2>
        <span className="signals-count">3</span>
        <TextButton onClick={() => notify("Opened all messages and handoffs")}>View all messages and handoffs</TextButton>
      </div>
      <div className="signal-list">
        {caseSignals.map((item, index) => (
          <article className="signal-item" key={item.title}>
            <IconBadge icon={item.icon} accent={item.accent} />
            <div className="signal-copy">
              <div className="signal-title-line">
                <strong>{item.title}</strong>
                {item.tag && <><i>•</i><span className={`tag tag--${item.accent}`}>{item.tag}</span></>}
              </div>
              <small>{item.meta}</small>
              {item.note && <p>{item.note}</p>}
            </div>
            <div className={`signal-meta${index > 0 ? " signal-meta--time-first" : ""}`}>
              <TextButton onClick={() => notify(`${item.action}: ${item.title}`)}>{item.action}</TextButton>
              <time>{item.time}</time>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RecentHandoffs({ notify }: { notify: (message: string) => void }) {
  return (
    <section className="card handoffs-card" aria-labelledby="handoffs-title">
      <div className="plain-heading">
        <h2 id="handoffs-title">Recent handoffs</h2>
        <TextButton onClick={() => notify("Opened all handoffs")}>View all</TextButton>
      </div>
      <div className="handoff-list">
        {handoffs.map((item, index) => (
          <button className="handoff-item" type="button" key={item.title} onClick={() => notify(item.title)}>
            <span className={`handoff-marker${index < handoffs.length - 1 ? " handoff-marker--connected" : ""}`}>
              <IconBadge icon={item.icon} accent={item.accent} />
              <i className={`timeline-dot timeline-dot--${item.accent}`} />
            </span>
            <span className="handoff-copy"><strong>{item.title}</strong><small>{item.meta}</small></span>
            <time>{item.time}</time>
          </button>
        ))}
      </div>
    </section>
  );
}

function RecentActivity({ notify }: { notify: (message: string) => void }) {
  return (
    <section className="card bottom-card activity-card" aria-labelledby="activity-title">
      <SectionHeading id="activity-title" icon={Clock3} action={<TextButton onClick={() => notify("Opened full activity")}>View all activity</TextButton>}>Recent Activity</SectionHeading>
      <div className="activity-list">
        {activities.map((item) => (
          <article className="activity-item" key={`${item.time}-${item.title}`}>
            <time>{item.time}</time>
            <IconBadge icon={item.icon} accent={item.accent} small />
            <span><strong title={item.title}>{item.title}</strong><small>{item.meta}</small></span>
          </article>
        ))}
      </div>
    </section>
  );
}

function UpNext({ notify }: { notify: (message: string) => void }) {
  return (
    <section className="card bottom-card up-next-card" aria-labelledby="up-next-title">
      <SectionHeading id="up-next-title" icon={ListChecks}>Up Next</SectionHeading>
      <div className="up-next-list">
        {upNext.map((item) => (
          <article className="up-next-item" key={item.id}>
            <IconBadge icon={item.icon} accent={item.accent} small />
            <span><strong title={item.service}>{item.service}</strong><small>{item.id}</small></span>
            <em className={`sla-text--${item.accent}`}>{item.due}</em>
            <TextButton onClick={() => notify(`Opened ${item.service}`)}>Open</TextButton>
          </article>
        ))}
      </div>
    </section>
  );
}

function ActionRequired({ notify }: { notify: (message: string) => void }) {
  return (
    <section className="card bottom-card action-card" aria-labelledby="action-title">
      <SectionHeading id="action-title" icon={ListChecks}>Action Required</SectionHeading>
      <div className="action-list">
        {actions.map((item) => (
          <button type="button" className="action-item" key={item.label} onClick={() => notify(item.label)}>
            <item.icon className={`line-icon line-icon--${item.accent}`} strokeWidth={2.15} />
            <span>{item.label}</span>
            <b className={`count count--${item.accent}`}>{item.count}</b>
          </button>
        ))}
      </div>
    </section>
  );
}

function RhythmChart({ period }: { period: string }) {
  const series = chartSeries[period];
  const x = [28, 75, 122, 169, 216, 263, 310];
  const y = (value: number) => 128 - (value / 30) * 100;
  const points = (values: number[]) => values.map((value, index) => `${x[index]},${y(value)}`).join(" ");
  return (
    <svg className="rhythm-chart" viewBox="0 0 338 172" role="img" aria-label={`Workload and completions for ${period.toLowerCase()}`}>
      {[0, 10, 20, 30].map((tick) => <g key={tick}><line x1="27" x2="312" y1={y(tick)} y2={y(tick)} /><text x="4" y={y(tick) + 4}>{tick}</text></g>)}
      <polyline className="chart-line chart-line--blue" points={points(series.workload)} />
      <polyline className="chart-line chart-line--green" points={points(series.completions)} />
      {series.workload.map((value, index) => <circle className="chart-dot chart-dot--blue" cx={x[index]} cy={y(value)} r="3" key={`w-${index}`} />)}
      {series.completions.map((value, index) => <circle className="chart-dot chart-dot--green" cx={x[index]} cy={y(value)} r="3" key={`c-${index}`} />)}
      {series.labels.map((label, index) => <text className="chart-label" x={x[index]} y="162" textAnchor="middle" key={label}>{label}</text>)}
    </svg>
  );
}

function MyRhythm({ notify }: { notify: (message: string) => void }) {
  const [period, setPeriod] = useState("Last 7 days");
  return (
    <section className="card bottom-card rhythm-card" aria-labelledby="rhythm-title">
      <SectionHeading
        id="rhythm-title"
        icon={CalendarDays}
        action={
          <label className="period-select">
            <span className="sr-only">Chart period</span>
            <select value={period} onChange={(event) => setPeriod(event.target.value)}>{Object.keys(chartSeries).map((item) => <option key={item}>{item}</option>)}</select>
          </label>
        }
      >My rhythm</SectionHeading>
      <div className="chart-legend"><span><i className="legend-blue" />Workload</span><span><i className="legend-green" />Completions</span></div>
      <div className="rhythm-body">
        <RhythmChart period={period} />
        <div className="sla-summary">
          <div className="sla-ring"><div><strong>92%</strong><span>SLA on time</span></div></div>
          <TextButton onClick={() => notify("Opened SLA details")}>View details</TextButton>
        </div>
      </div>
    </section>
  );
}

export default function OfficerDashboardHighFidelity({ embedded = true }: OfficerDashboardProps) {
  const [toast, setToast] = useState("");
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  return (
    <main
      className={`d31-officer-reference officer-dashboard officer-dashboard--${embedded ? "embedded" : "standalone"}`}
      data-dashboard-version="command-center-v4"
    >
      <div className="dashboard-frame">
        <div className="dashboard-top-grid">
          <WorkPlan notify={notify} />
          <aside className="dashboard-side-stack">
            <CaseSignals notify={notify} />
            <RecentHandoffs notify={notify} />
          </aside>
        </div>

        <div className="dashboard-bottom-grid">
          <RecentActivity notify={notify} />
          <UpNext notify={notify} />
          <ActionRequired notify={notify} />
          <MyRhythm notify={notify} />
        </div>
      </div>
      <div className={`dashboard-toast${toast ? " is-visible" : ""}`} role="status" aria-live="polite"><Check />{toast}</div>
    </main>
  );
}
