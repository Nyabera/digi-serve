"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileBarChart,
  FileText,
  Inbox,
  ListChecks,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import "./officer-dashboard-reference.css";

type Accent = "blue" | "orange" | "red" | "green" | "violet";
type PlanTab = "Needs action" | "Waiting on others" | "Ready to complete";
type SignalTab = "Messages" | "Assignments" | "Notices" | "Case Updates";

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

const planCounts: Record<PlanTab, number> = {
  "Needs action": 3,
  "Waiting on others": 3,
  "Ready to complete": 2,
};

const planTabLines: Record<PlanTab, readonly [string, string]> = {
  "Needs action": ["Needs", "action"],
  "Waiting on others": ["Waiting on", "others"],
  "Ready to complete": ["Ready to", "complete"],
};

const signalContent: Record<SignalTab, Array<{ title: string; note: string }>> = {
  Messages: [
    { title: "Brian Otieno", note: "I uploaded the requested documents. Please confirm if everything is in order." },
    { title: "Mercy Akinyi", note: "I have attached the payment receipt for your review." },
  ],
  Assignments: [
    { title: "3 new cases assigned", note: "Two transcript requests and one clearance letter were added to your queue." },
    { title: "Priority changed", note: "REQ-2026-0715 is now marked urgent by the Records Office." },
  ],
  Notices: [
    { title: "Records desk closes at 4:30 PM", note: "Complete physical file requests before the daily registry handoff." },
    { title: "SLA policy updated", note: "Clarification wait time now pauses the request SLA automatically." },
  ],
  "Case Updates": [
    { title: "REQ-2026-0718 moved forward", note: "Finance confirmed the applicant payment reference." },
    { title: "REQ-2026-0709 returned", note: "Admissions supplied the missing eligibility document." },
  ],
};

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

function IconBadge({ icon: Icon, accent, small = false }: { icon: LucideIcon; accent: Accent; small?: boolean }) {
  return (
    <span className={`icon-badge icon-badge--${accent}${small ? " icon-badge--small" : ""}`} aria-hidden="true">
      <Icon strokeWidth={2.2} />
    </span>
  );
}

function TextButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button type="button" className={`text-button ${className}`} onClick={onClick}>
      {children}
    </button>
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

function WorkloadPulse() {
  const stats = [
    { value: "18", label: "Assigned", accent: "blue" as Accent, icon: ListChecks, width: "78%" },
    { value: "7", label: "Due today", accent: "orange" as Accent, icon: Clock3, width: "66%" },
    { value: "3", label: "Overdue", accent: "red" as Accent, icon: Inbox, width: "61%" },
    { value: "92%", label: "SLA on time", accent: "green" as Accent, icon: CheckCircle2, width: "82%" },
  ];

  return (
    <section className="card workload-card" aria-labelledby="workload-title">
      <h2 id="workload-title">Workload pulse</h2>
      <div className="workload-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className="workload-stat" key={stat.label}>
              <span className={`metric-icon metric-icon--${stat.accent}`}><Icon strokeWidth={2.15} /></span>
              <div className="metric-copy">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
                <div className="metric-track"><i className={`fill--${stat.accent}`} style={{ width: stat.width }} /></div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
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
    <section className="card work-plan-card" aria-labelledby="plan-title">
      <h2 id="plan-title">Today&apos;s work plan</h2>
      <div className="plan-tabs" role="tablist" aria-label="Work plan filters">
        {(Object.keys(planCounts) as PlanTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "is-active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            <span className="plan-tab-label">
              <span>{planTabLines[tab][0]}</span>
              <span>{planTabLines[tab][1]}</span>
            </span>
            <span className="plan-tab-count">{planCounts[tab]}</span>
          </button>
        ))}
      </div>
      <div className="work-table-wrap">
        <table className="work-table">
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
                    <span className={`service-icon service-icon--${item.accent}`}><Icon strokeWidth={2.25} /></span>
                    <strong>{item.service}</strong>
                  </td>
                  <td data-label="Applicant">{item.applicant}</td>
                  <td data-label="Request ID"><RequestId value={item.requestId} /></td>
                  <td data-label="Next action" className="next-action-copy" title={item.nextAction}>{item.nextAction}</td>
                  <td data-label="Stage">{item.stage}</td>
                  <td data-label="SLA"><div className={`sla-line sla-line--${item.accent}`}><i /></div><span className={`sla-text--${item.accent}`}>{item.sla}</span></td>
                  <td data-label="Status"><span className={`status status--${item.accent}`}>{item.status}</span></td>
                  <td data-label="Action"><TextButton onClick={() => notify(`${item.action}: ${item.service}`)}>{item.action}</TextButton></td>
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
  const [tab, setTab] = useState<SignalTab>("Messages");
  const items = signalContent[tab];

  return (
    <section className="card signals-card" aria-labelledby="signals-title">
      <h2 id="signals-title">Case signals</h2>
      <div className="signal-tabs" role="tablist" aria-label="Case signals">
        {(Object.keys(signalContent) as SignalTab[]).map((item) => (
          <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? "is-active" : ""} onClick={() => setTab(item)}>{item}</button>
        ))}
        <TextButton className="mark-read" onClick={() => notify("All case signals marked as read")}>Mark all read</TextButton>
      </div>
      <div className="signal-list">
        {items.map((item, index) => (
          <article className="signal-item" key={`${tab}-${item.title}`}>
            {tab === "Messages" ? <span className={`avatar avatar--${index ? "orange" : "violet"}`}>{index ? "MA" : "BO"}</span> : <IconBadge icon={tab === "Assignments" ? UserRoundCheck : tab === "Notices" ? CircleHelp : RefreshCw} accent={index ? "blue" : "green"} />}
            <div className="signal-copy">
              <div className="signal-heading"><strong>{item.title}</strong>{tab === "Messages" && <><i>•</i><span>Unread</span></>}</div>
              <p>{item.note}</p>
              <small>{index ? "Certificate Replacement   •   REQ-2026-0718" : "Transcript Request   •   REQ-2026-0715"}</small>
            </div>
            <div className="signal-meta"><time>{index ? "8:50 AM" : "9:35 AM"}</time><TextButton onClick={() => notify(`${tab}: ${item.title}`)}>{tab === "Messages" ? "Reply" : "Open"}</TextButton></div>
          </article>
        ))}
        <article className="signal-item signal-item--compact">
          <IconBadge icon={ArrowUp} accent="green" />
          <div className="signal-copy"><div className="signal-heading"><strong>From Admissions Office</strong><i>•</i><span className="tag tag--green">Handoff</span></div><small>Transcript Request   •   REQ-2026-0709</small><p>Please review documents and confirm eligibility.</p></div>
          <div className="signal-meta"><time>9:12 AM</time><TextButton onClick={() => notify("Opened Admissions handoff")}>View case</TextButton></div>
        </article>
        <article className="signal-item signal-item--compact">
          <IconBadge icon={ArrowUp} accent="blue" />
          <div className="signal-copy"><div className="signal-heading"><strong>To Finance Office</strong><i>•</i><span className="tag tag--blue">Handoff sent</span></div><small>Certificate Replacement   •   REQ-2026-0718</small><p>Sent for payment verification.</p></div>
          <div className="signal-meta"><time>Yesterday</time><TextButton onClick={() => notify("Opened Finance handoff")}>View handoff</TextButton></div>
        </article>
      </div>
      <TextButton className="view-all" onClick={() => notify("Opened all messages and handoffs")}>View all messages and handoffs <ArrowRight /></TextButton>
    </section>
  );
}

function RecentHandoffs({ notify }: { notify: (message: string) => void }) {
  const items = [
    { title: "From Admissions Office", meta: "Transcript Request   •   REQ-2026-0709", time: "9:12 AM", icon: ArrowDown, accent: "green" as Accent },
    { title: "To Finance Office", meta: "Certificate Replacement   •   REQ-2026-0718", time: "8:45 AM", icon: ArrowUp, accent: "blue" as Accent },
    { title: "Completed to Applicant", meta: "Clearance Letter   •   REQ-2026-0698", time: "Yesterday", icon: CheckCircle2, accent: "green" as Accent },
  ];
  return (
    <section className="card handoffs-card" aria-labelledby="handoffs-title">
      <div className="card-heading-row"><h2 id="handoffs-title">Recent handoffs</h2><TextButton onClick={() => notify("Opened all handoffs")}>View all <ArrowRight /></TextButton></div>
      <div className="handoff-list">
        {items.map((item) => (
          <button className="handoff-item" type="button" key={item.title} onClick={() => notify(item.title)}>
            <IconBadge icon={item.icon} accent={item.accent} />
            <span><strong>{item.title}</strong><small>{item.meta}</small></span>
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
      <div className="card-heading-row"><h2 id="activity-title">Recent Activity</h2><TextButton onClick={() => notify("Opened full activity")}>View all activity <ArrowRight /></TextButton></div>
      <div className="activity-list">
        {activities.map((item) => (
          <article className="activity-item" key={`${item.time}-${item.title}`}>
            <time>{item.time}</time><IconBadge icon={item.icon} accent={item.accent} small />
            <span><strong>{item.title}</strong><small>{item.meta}</small></span>
          </article>
        ))}
      </div>
    </section>
  );
}

function UpNext({ notify }: { notify: (message: string) => void }) {
  return (
    <section className="card bottom-card up-next-card" aria-labelledby="up-next-title">
      <h2 id="up-next-title">Up Next</h2>
      <div className="up-next-list">
        {upNext.map((item) => (
          <article className="up-next-item" key={item.id}>
            <IconBadge icon={item.icon} accent={item.accent} small />
            <span><strong>{item.service}</strong><small>{item.id}</small></span>
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
      <h2 id="action-title">Action Required</h2>
      <div className="action-list">
        {actions.map((item) => (
          <button type="button" className="action-item" key={item.label} onClick={() => notify(item.label)}>
            <item.icon className={`line-icon line-icon--${item.accent}`} strokeWidth={2.15} />
            <span>{item.label}</span><b className={`count count--${item.accent}`}>{item.count}</b><ChevronRight />
          </button>
        ))}
      </div>
    </section>
  );
}

function RhythmChart({ period }: { period: string }) {
  const series = chartSeries[period];
  const x = [25, 74, 123, 172, 221, 270, 319];
  const y = (value: number) => 130 - (value / 30) * 108;
  const points = (values: number[]) => values.map((value, index) => `${x[index]},${y(value)}`).join(" ");
  return (
    <svg className="rhythm-chart" viewBox="0 0 344 174" role="img" aria-label={`Workload and completions for ${period.toLowerCase()}`}>
      {[0, 10, 20, 30].map((tick) => <g key={tick}><line x1="24" x2="323" y1={y(tick)} y2={y(tick)} /><text x="4" y={y(tick) + 4}>{tick}</text></g>)}
      <polyline className="chart-line chart-line--blue" points={points(series.workload)} />
      <polyline className="chart-line chart-line--green" points={points(series.completions)} />
      {series.workload.map((value, index) => <circle className="chart-dot chart-dot--blue" cx={x[index]} cy={y(value)} r="3.2" key={`w-${index}`} />)}
      {series.completions.map((value, index) => <circle className="chart-dot chart-dot--green" cx={x[index]} cy={y(value)} r="3.2" key={`c-${index}`} />)}
      {series.labels.map((label, index) => <text className="chart-label" x={x[index]} y="163" textAnchor="middle" key={label}>{label}</text>)}
    </svg>
  );
}

function MyRhythm({ notify }: { notify: (message: string) => void }) {
  const [period, setPeriod] = useState("Last 7 days");
  return (
    <section className="card bottom-card rhythm-card" aria-labelledby="rhythm-title">
      <div className="card-heading-row"><h2 id="rhythm-title">My rhythm</h2><label className="period-select"><span className="sr-only">Chart period</span><select value={period} onChange={(event) => setPeriod(event.target.value)}>{Object.keys(chartSeries).map((item) => <option key={item}>{item}</option>)}</select><ChevronDown /></label></div>
      <div className="chart-legend"><span><i className="legend-blue" />Workload</span><span><i className="legend-green" />Completions</span></div>
      <div className="rhythm-body">
        <RhythmChart period={period} />
        <div className="sla-summary">
          <div className="sla-ring"><div><strong>92%</strong><span>SLA on time</span></div></div>
          <TextButton onClick={() => notify("Opened SLA details")}>View details <ArrowRight /></TextButton>
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
      data-dashboard-version="spacious-v3"
    >
      <div className="dashboard-frame">
        <header className="dashboard-header">
          <h1>Good afternoon, Grace</h1>
          <p>Officer dashboard <i>•</i> Thursday, May 8, 2026</p>
        </header>

        <div className="dashboard-top-grid">
          <div className="dashboard-left-column"><WorkloadPulse /><WorkPlan notify={notify} /></div>
          <aside className="dashboard-right-column"><CaseSignals notify={notify} /><RecentHandoffs notify={notify} /></aside>
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
