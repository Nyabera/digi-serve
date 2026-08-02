"use client";

import {
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  FileClock,
  FileText,
  FolderOpen,
  Network,
  Search,
  Siren,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type AdminDashboardReferenceData, type Tone } from "./admin-dashboard-reference-data";

export type AdminDashboardProps = {
  readonly data: AdminDashboardReferenceData;
};

type Notify = (message: string) => void;

const metricIcons: LucideIcon[] = [FileText, CheckCircle2, FolderOpen, Clock3, BarChart3, Siren];

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`adm-card ${className}`}>{children}</section>;
}

function TextAction({ children, onClick, className = "" }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return <button type="button" className={`adm-text-action ${className}`} onClick={onClick}>{children}</button>;
}

function PanelHeader({ title, detail, action, onAction }: { title: string; detail?: ReactNode; action?: string; onAction?: () => void }) {
  return (
    <div className="adm-panel-header">
      <div><h3>{title}</h3>{detail ? <span>{detail}</span> : null}</div>
      {action ? <TextAction onClick={onAction}>{action}</TextAction> : null}
    </div>
  );
}

function ToneIcon({ icon: Icon, tone = "blue", small = false }: { icon: LucideIcon; tone?: Tone; small?: boolean }) {
  return <span className={`adm-tone-icon adm-tone-icon--${tone}${small ? " adm-tone-icon--small" : ""}`}><Icon strokeWidth={2} /></span>;
}

function ZoneHeading({ number, title, tools, description }: { number: number; title: string; tools?: ReactNode; description?: ReactNode }) {
  return (
    <header className={`adm-zone-heading${description ? " adm-zone-heading--hero" : ""}`}>
      <div className="adm-zone-title"><span>ZONE {number}</span><h2>{title}</h2></div>
      {description ? <div className="adm-zone-description">{description}</div> : null}
      {tools ? <div className="adm-zone-tools">{tools}</div> : null}
    </header>
  );
}

function HeaderTools({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  const [query, setQuery] = useState("");
  return (
    <>
      <label className="adm-search">
        <Search /><span className="adm-sr-only">Search the organization</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") notify(query ? `Searching for “${query}”` : "Enter a search term"); }} placeholder="Search requests, services, departments..." />
      </label>
      <button type="button" className="adm-date-control" onClick={() => notify("Date range selector opened")}><CalendarDays /><span>{data.identity.dateRange}</span><ChevronDown /></button>
      <button type="button" className="adm-notification" aria-label="Notifications" onClick={() => notify("5 administrator notifications")}><Bell /><b>5</b></button>
    </>
  );
}

function ExecutiveBrief({ data }: { data: AdminDashboardReferenceData }) {
  return (
    <Card className="adm-executive-brief">
      <div className="adm-brief-icon"><FileText /></div>
      <div><h3>Executive brief</h3><p>{data.executiveBrief}</p></div>
      <div className="adm-campus-art" aria-hidden="true">
        <Building2 /><span /><span /><span />
      </div>
    </Card>
  );
}

function MetricStrip({ data }: { data: AdminDashboardReferenceData }) {
  return (
    <div className="adm-metric-strip">
      {data.metrics.map((metric, index) => {
        const Icon = metricIcons[index] ?? FileText;
        const negative = metric.direction === "down";
        return (
          <Card className="adm-metric" key={metric.label}>
            <ToneIcon icon={Icon} tone={metric.tone as Tone} />
            <div><small>{metric.label}</small><strong>{metric.value}</strong><p className={negative ? "is-negative" : "is-positive"}>{metric.direction.startsWith("down") ? "▼" : "▲"} {metric.delta} <span>{metric.comparison}</span></p></div>
          </Card>
        );
      })}
    </div>
  );
}

const chartTooltipStyle = { borderRadius: 9, border: "1px solid #dfe6f0", boxShadow: "0 8px 24px rgba(18, 35, 69, .1)", fontSize: 11 };

function DeliveryChart({ data }: { data: AdminDashboardReferenceData }) {
  return (
    <Card className="adm-delivery-card">
      <PanelHeader title="Service Delivery Trend" />
      <div className="adm-chart-legend"><span className="is-blue">Submitted</span><span className="is-teal">Completed</span><span className="is-orange">Backlog (Open)</span></div>
      <div className="adm-delivery-chart adm-chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={[...data.deliveryTrend]} margin={{ top: 8, right: 6, bottom: 0, left: -24 }}>
            <CartesianGrid stroke="#e9eef5" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#5f6e89" }} tickLine={false} axisLine={false} interval={1} />
            <YAxis tick={{ fontSize: 9, fill: "#5f6e89" }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Bar dataKey="submitted" fill="#1267e9" radius={[2, 2, 0, 0]} barSize={11} />
            <Bar dataKey="completed" fill="#18a79d" radius={[2, 2, 0, 0]} barSize={11} />
            <Line dataKey="backlog" stroke="#f5a300" strokeWidth={2.2} dot={{ fill: "#f5a300", r: 2.5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function Alerts({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <Card className="adm-alerts-card">
      <PanelHeader title="Institutional Alerts" action="View all" onAction={() => notify("Opened all institutional alerts")} />
      <div className="adm-alert-list">
        {data.alerts.map((alert, index) => (
          <button key={alert.title} type="button" onClick={() => notify(alert.title)}>
            <ToneIcon icon={index === 3 ? Clock3 : AlertTriangle} tone={alert.tone as Tone} small />
            <span><strong>{alert.title}</strong><small>{alert.meta}</small></span>
            <em className={`adm-priority adm-priority--${alert.priority.toLowerCase()}`}>{alert.priority}</em>
          </button>
        ))}
      </div>
    </Card>
  );
}

function DepartmentTable({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <Card className="adm-department-table-card">
      <PanelHeader title="Department Performance Comparison" action="View full report" onAction={() => notify("Opened department performance report")} />
      <div className="adm-table-scroll"><table className="adm-data-table adm-department-table">
        <thead><tr><th>#</th><th>Department</th><th>Submitted</th><th>Completed</th><th>Completion rate</th><th>Avg turnaround</th><th>SLA compliance</th></tr></thead>
        <tbody>{data.departments.map((row) => <tr key={row.name}>
          <td>{row.rank}</td><td>{row.name}</td><td>{row.submitted}</td><td>{row.completed}</td>
          <td><div className="adm-rate-cell"><span>{row.rate}%</span><i><b style={{ width: `${row.rate}%` }} /></i></div></td>
          <td>{row.turnaround}</td><td><span className="adm-sla-value">{row.sla}% <i className={`is-${row.slaTone}`} /></span></td>
        </tr>)}</tbody>
      </table></div>
    </Card>
  );
}

function ZoneOne({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <section className="adm-zone adm-zone-one" id="admin-zone-one">
      <ZoneHeading number={1} title="Institution-wide health" tools={<HeaderTools data={data} notify={notify} />} description={<><h3>Organization overview</h3><p>A real-time snapshot of institutional service performance.</p></>} />
      <ExecutiveBrief data={data} />
      <MetricStrip data={data} />
      <div className="adm-zone-one-panels"><DeliveryChart data={data} /><Alerts data={data} notify={notify} /></div>
      <DepartmentTable data={data} notify={notify} />
    </section>
  );
}

function SlaMonitor() {
  return (
    <Card className="adm-sla-card">
      <PanelHeader title="Institution-wide SLA Monitor" />
      <div className="adm-sla-body">
        <div className="adm-donut adm-donut--sla"><div><strong>91%</strong><span>SLA compliance</span></div></div>
        <div className="adm-sla-notes">
          <div><i className="is-orange" /><span><small>Due soon</small><strong>28</strong><em>Requests due within<br />next 48 hours</em></span></div>
          <div><i className="is-red" /><span><small>Active breaches</small><strong>2</strong><em>Require immediate<br />attention</em></span></div>
        </div>
      </div>
    </Card>
  );
}

function StatusBars({ data }: { data: AdminDashboardReferenceData }) {
  return (
    <Card className="adm-status-card">
      <PanelHeader title="Requests by Status" />
      <div className="adm-horizontal-bars">
        {data.statusBars.map((row) => <div className="adm-bar-row" key={row.label}><span>{row.label}</span><i><b className={`is-${row.tone}`} style={{ width: `${row.percentage}%` }} /></i><em>{row.value.toLocaleString()} <small>({row.percentage < 1 ? "<1" : row.percentage}%)</small></em></div>)}
        <div className="adm-bar-total"><span>Total</span><strong>1,248</strong></div>
      </div>
    </Card>
  );
}

function ServiceBars({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <Card className="adm-service-card">
      <PanelHeader title="Requests by Service" action="View all" onAction={() => notify("Opened all service request volumes")} />
      <div className="adm-service-bars">{data.serviceBars.map((row) => <div key={row.label}><span>{row.label}</span><i><b style={{ width: `${row.width}%` }} /></i><em>{row.count} <small>({row.duration})</small></em></div>)}</div>
    </Card>
  );
}

function CapacityHeatmap({ data }: { data: AdminDashboardReferenceData }) {
  return (
    <Card className="adm-heatmap-card">
      <PanelHeader title="Requests by Department" detail="(Capacity Heatmap)" />
      <div className="adm-heatmap">
        <div className="adm-heatmap-head"><span>Dept / Load</span><span>Low</span><span>Moderate</span><span>High</span><span>Very High</span></div>
        {data.heatmap.map((row) => <div className="adm-heatmap-row" key={row.department}><strong>{row.department}</strong>{row.values.map((value, index) => <span className={`level-${index + 1}`} key={`${row.department}-${index}`}>{value}%</span>)}</div>)}
      </div>
    </Card>
  );
}

function Bottlenecks({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <Card className="adm-bottleneck-card">
      <PanelHeader title="Workflow Bottlenecks" detail="(Avg Stage Duration)" action="View all" onAction={() => notify("Opened all workflow bottlenecks")} />
      <div className="adm-bottlenecks">{data.bottlenecks.map((row, index) => <div key={row.label}><ToneIcon icon={index === 4 ? Network : FileClock} tone={row.tone as Tone} small /><span>{row.label}</span><i><b className={`is-${row.tone}`} style={{ width: `${row.width}%` }} /></i><em>{row.value}</em></div>)}</div>
    </Card>
  );
}

function HandoffNetwork({ notify }: { notify: Notify }) {
  return (
    <Card className="adm-network-card">
      <PanelHeader title="Handoff Network" action="View all" onAction={() => notify("Opened full handoff network")} />
      <div className="adm-network" role="img" aria-label="Department handoff network">
        <svg viewBox="0 0 330 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path className="frequent" d="M70 76 L165 25 M70 76 L168 77 M70 76 L165 128 M165 25 L168 77 M168 77 L165 128" />
          <path className="occasional" d="M165 25 L270 42 M168 77 L272 75 M165 128 L269 115 M168 77 L270 42 M168 77 L269 115" />
        </svg>
        <button className="node node-student" type="button" onClick={() => notify("Student Affairs handoffs")}>Student<br />Affairs</button>
        <button className="node node-registry" type="button" onClick={() => notify("Registry handoffs")}>Registry</button>
        <button className="node node-finance" type="button" onClick={() => notify("Finance handoffs")}>Finance</button>
        <button className="node node-academic" type="button" onClick={() => notify("Academic Affairs handoffs")}>Academic<br />Affairs</button>
        <button className="node node-bursary" type="button" onClick={() => notify("Bursary handoffs")}>Bursary</button>
        <button className="node node-ict" type="button" onClick={() => notify("ICT Services handoffs")}>ICT<br />Services</button>
        <button className="node node-external" type="button" onClick={() => notify("External agency handoffs")}>External<br />Agencies</button>
      </div>
      <div className="adm-network-legend"><span>Frequent handoff</span><span>Occasional handoff</span></div>
    </Card>
  );
}

function ApprovalsTable({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <Card className="adm-approvals-card">
      <PanelHeader title="Approvals and Escalations" action="View all" onAction={() => notify("Opened all approvals and escalations")} />
      <div className="adm-table-scroll"><table className="adm-data-table adm-approvals-table">
        <thead><tr><th>Type</th><th>Item</th><th>From</th><th>Raised</th><th>Priority</th><th>Action</th></tr></thead>
        <tbody>{data.approvals.map((row) => <tr key={row.item}>
          <td><span className={row.type === "Escalation" ? "adm-type adm-type--escalation" : "adm-type"}>{row.type === "Escalation" ? <AlertTriangle /> : <CheckCircle2 />}{row.type}</span></td>
          <td>{row.item}</td><td>{row.from}</td><td>{row.raised}</td><td><span className={`adm-priority adm-priority--${row.priority.toLowerCase()}`}>{row.priority}</span></td>
          <td><TextAction onClick={() => notify(`${row.action}: ${row.item}`)}>{row.action}</TextAction></td>
        </tr>)}</tbody>
      </table></div>
    </Card>
  );
}

function ZoneTwo({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <section className="adm-zone adm-zone-two" id="admin-zone-two">
      <ZoneHeading number={2} title="Operational visibility" />
      <div className="adm-zone-two-top"><SlaMonitor /><StatusBars data={data} /><ServiceBars data={data} notify={notify} /></div>
      <div className="adm-zone-two-middle"><CapacityHeatmap data={data} /><Bottlenecks data={data} notify={notify} /><HandoffNetwork notify={notify} /></div>
      <ApprovalsTable data={data} notify={notify} />
    </section>
  );
}

function CompactBars({ rows, tone = "blue" }: { rows: readonly { label: string; value: string | number; width: number }[]; tone?: Tone }) {
  return <div className="adm-compact-bars">{rows.map((row) => <div key={row.label}><span>{row.label}</span><i><b className={`is-${tone}`} style={{ width: `${row.width}%` }} /></i><em>{row.value}</em></div>)}</div>;
}

function PaymentOverview({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <Card className="adm-payment-card">
      <PanelHeader title="Payment Overview" action="View all" onAction={() => notify("Opened payment overview")} />
      <div className="adm-mini-metrics">{data.payments.metrics.map((metric) => <div key={metric.label}><small>{metric.label}</small><strong>{metric.value}</strong><span className={`is-${metric.tone}`}>{metric.tone === "red" ? "▼" : "▲"} {metric.delta} <em>vs Apr</em></span></div>)}</div>
      <h4>Revenue by Service <span>(Confirmed)</span></h4>
      <CompactBars rows={data.payments.revenue} />
      <div className="adm-axis"><span>0</span><span>1M</span><span>2M</span><span>3M</span></div>
    </Card>
  );
}

function DocumentOperations({ data }: { data: AdminDashboardReferenceData }) {
  return (
    <Card className="adm-document-card">
      <PanelHeader title="Document Operations" />
      <div className="adm-mini-metrics adm-mini-metrics--four">{data.documents.metrics.map((metric) => <div key={metric.label}><small>{metric.label}</small><strong>{metric.value}</strong><span className={`is-${metric.tone}`}>{metric.tone === "red" ? "▼" : "▲"} {metric.delta}</span></div>)}</div>
      <h4>Top Document Types <span>(Issued)</span></h4>
      <CompactBars rows={data.documents.types} />
    </Card>
  );
}

function VerificationActivity({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <Card className="adm-verification-card">
      <PanelHeader title="Certificate & Verification Activity" action="View all" onAction={() => notify("Opened verification activity")} />
      <div className="adm-verification-summary"><div><small>Verifications</small><strong>845</strong><span>▲ 13%</span></div><div className="adm-donut adm-donut--success"><div><small>Success rate</small><strong>98%</strong></div></div></div>
      <h4>Verification Trend</h4>
      <div className="adm-verification-chart adm-chart-box"><ResponsiveContainer width="100%" height="100%"><LineChart data={[...data.verificationTrend]} margin={{ top: 8, right: 4, bottom: 0, left: -28 }}><CartesianGrid stroke="#edf1f6" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: 8, fill: "#66748e" }} tickLine={false} axisLine={false} interval={3} /><YAxis tick={{ fontSize: 8, fill: "#66748e" }} tickLine={false} axisLine={false} /><Tooltip contentStyle={chartTooltipStyle} /><Line type="monotone" dataKey="value" stroke="#13a89e" strokeWidth={2} dot={{ r: 2.5, fill: "white", strokeWidth: 1.5 }} /></LineChart></ResponsiveContainer></div>
    </Card>
  );
}

function Renewals({ data }: { data: AdminDashboardReferenceData }) {
  return (
    <Card className="adm-renewals-card">
      <PanelHeader title="Renewals and Expiries" detail="(Next 90 Days)" />
      <div className="adm-renewal-timeline"><i />{data.renewals.map((row) => <div key={row.title}><b className={`is-${row.tone}`} /><strong>{row.title}</strong><span>{row.date}</span><em>{row.days}</em></div>)}</div>
    </Card>
  );
}

function ZoneThree({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <section className="adm-zone adm-zone-three" id="admin-zone-three">
      <ZoneHeading number={3} title="Financial and document control" />
      <div className="adm-zone-three-panels"><PaymentOverview data={data} notify={notify} /><DocumentOperations data={data} /><VerificationActivity data={data} notify={notify} /></div>
      <Renewals data={data} />
    </section>
  );
}

function RiskFeed({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <Card className="adm-risk-card">
      <PanelHeader title="Audit & Compliance Risk Feed" action="View all" onAction={() => notify("Opened compliance risk feed")} />
      <div className="adm-risk-list">{data.risks.map((risk) => <button type="button" key={risk.label} onClick={() => notify(risk.label)}><FileText /><span>{risk.label}</span><em className={`adm-priority adm-priority--${risk.priority.toLowerCase()}`}>{risk.priority}</em><time>{risk.date}</time></button>)}</div>
    </Card>
  );
}

function ExperienceFunnel() {
  const stages = [
    { label: "Applications", value: "3,245", width: 100 },
    { label: "In Review", value: "1,076", width: 78 },
    { label: "Responded", value: "1,256", width: 58 },
    { label: "Completed", value: "1,126", width: 38 },
  ];
  return (
    <Card className="adm-funnel-card">
      <PanelHeader title="Applicant Experience Funnel" />
      <div className="adm-funnel">{stages.map((stage, index) => <div key={stage.label} className={`level-${index + 1}`} style={{ width: `${stage.width}%` }}><span>{stage.label}</span><strong>{stage.value}</strong></div>)}</div>
      <p>Completion rate <strong>35%</strong></p>
    </Card>
  );
}

function AdoptionChart({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <Card className="adm-adoption-card">
      <PanelHeader title="Platform Adoption" detail="(30 Days)" action="View all" onAction={() => notify("Opened platform adoption report")} />
      <div className="adm-adoption-metrics"><div><span>Active Users</span><strong>612</strong><small>▲ 9%</small></div><div><span>Sessions</span><strong>2,845</strong><small>▲ 12%</small></div><div><span>Feature Usage</span><strong>78%</strong><small>▲ 6pp</small></div></div>
      <div className="adm-adoption-chart adm-chart-box"><ResponsiveContainer width="100%" height="100%"><LineChart data={[...data.adoption]} margin={{ top: 8, right: 4, bottom: 0, left: -26 }}><CartesianGrid stroke="#edf1f6" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: 7, fill: "#66748e" }} tickLine={false} axisLine={false} interval={3} /><YAxis tick={{ fontSize: 8, fill: "#66748e" }} tickLine={false} axisLine={false} /><Tooltip contentStyle={chartTooltipStyle} /><Line dataKey="users" stroke="#0d65ef" strokeWidth={2} dot={{ r: 2.3, fill: "#0d65ef" }} /></LineChart></ResponsiveContainer></div>
    </Card>
  );
}

function Leakage({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <Card className="adm-leakage-card">
      <PanelHeader title="External Coordination Leakage" action="View all" onAction={() => notify("Opened channel leakage report")} />
      <div className="adm-leakage-bars">{data.leakage.map((row) => <div key={row.label}><span>{row.label}</span><i><b className={`is-${row.tone}`} style={{ width: `${row.value * 2.7}%` }} /></i><em>{row.value}%</em></div>)}</div>
    </Card>
  );
}

function InstitutionalOutcomes({ notify }: { notify: Notify }) {
  return (
    <Card className="adm-outcomes-card">
      <PanelHeader title="Institutional Outcomes" detail="(Before vs After)" action="View all" onAction={() => notify("Opened institutional outcomes")} />
      <div className="adm-outcome-grid">
        <div><small>Avg Turnaround Time</small><strong>3.6 <em>days</em> → 2.8 <em>days</em></strong><span>▼ 22%</span></div>
        <div><small>SLA Compliance</small><strong>81% → 91%</strong><span>▲ 10pp</span></div>
        <div><small>Request Backlog</small><strong>214 → 162</strong><span>▼ 24%</span></div>
      </div>
      <div className="adm-overdue-summary"><span>Overdue Requests</span><strong>28 <em>→</em> 14</strong></div>
    </Card>
  );
}

function SystemHealth() {
  const modules = ["Application", "Database", "Integrations", "File Storage", "Security"];
  return (
    <Card className="adm-system-card">
      <PanelHeader title="System Health" detail="All systems operational" />
      <div className="adm-system-grid">{modules.map((module) => <div key={module}><Check /><strong>{module}</strong><span>Operational</span></div>)}</div>
    </Card>
  );
}

function RecentAdminActivity({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <Card className="adm-admin-activity-card">
      <PanelHeader title="Recent Administrative Activity" action="View all" onAction={() => notify("Opened administrative activity")} />
      <div className="adm-admin-activity">{data.recentActivity.map((row) => <button type="button" key={row.action} onClick={() => notify(row.action)}><span>{row.action}</span><em>{row.person}</em><time>{row.when}</time></button>)}</div>
    </Card>
  );
}

function ScheduledReports({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  const [enabled, setEnabled] = useState(() => Object.fromEntries(data.scheduledReports.map((report) => [report.name, true])) as Record<string, boolean>);
  return (
    <Card className="adm-scheduled-card">
      <PanelHeader title="Scheduled Reports" action="View all" onAction={() => notify("Opened report schedule")} />
      <div className="adm-scheduled-grid">{data.scheduledReports.map((report) => <div key={report.name}><span><strong>{report.name}</strong><small>{report.cadence}</small><em>{report.next}</em></span><button type="button" className={enabled[report.name] ? "is-on" : ""} aria-label={`Toggle ${report.name}`} onClick={() => { setEnabled((current) => ({ ...current, [report.name]: !current[report.name] })); notify(`${report.name} ${enabled[report.name] ? "disabled" : "enabled"}`); }}><i /></button></div>)}</div>
    </Card>
  );
}

function ZoneFive({ data, notify }: { data: AdminDashboardReferenceData; notify: Notify }) {
  return (
    <section className="adm-zone adm-zone-five" id="admin-zone-five">
      <ZoneHeading number={5} title="Governance and institutional insight" />
      <div className="adm-zone-five-top"><RiskFeed data={data} notify={notify} /><ExperienceFunnel /><AdoptionChart data={data} notify={notify} /><Leakage data={data} notify={notify} /></div>
      <div className="adm-zone-five-middle"><InstitutionalOutcomes notify={notify} /><SystemHealth /><RecentAdminActivity data={data} notify={notify} /></div>
      <ScheduledReports data={data} notify={notify} />
    </section>
  );
}

export function AdminDashboardHighFidelity({
  data,
}: AdminDashboardProps) {
  const [toast, setToast] = useState("");

  const notify: Notify = (message) => {
    setToast(message);
    window.setTimeout(
      () => setToast(""),
      2400,
    );
  };

  return (
    <div
      className="admin-dashboard admin-dashboard--embedded"
      data-dashboard-role="admin"
      data-dashboard-version="d31-admin-zones-v1"
    >
      <div className="adm-dashboard-body">
        <h1 className="adm-sr-only">Institution administrator dashboard</h1>
        <ZoneOne data={data} notify={notify} />
        <ZoneTwo data={data} notify={notify} />
        <ZoneThree data={data} notify={notify} />
        <ZoneFive data={data} notify={notify} />
      </div>

      <div
        className={`adm-toast${toast ? " is-visible" : ""}`}
        role="status"
      >
        {toast}
      </div>
    </div>
  );
}
