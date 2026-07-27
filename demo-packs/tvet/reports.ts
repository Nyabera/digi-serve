import type { DemoReportConfig } from "../../features/demo-engine/config";

export const tvetReportsDraft = {
  metrics: [
    {
      id: "total-requests",
      label: "Total Requests",
      value: 1248,
      change: "12.4%",
      trend: "up",
    },
    {
      id: "completion-rate",
      label: "Completion Rate",
      value: "91.8%",
      change: "3.1%",
      trend: "up",
    },
    {
      id: "average-resolution",
      label: "Average Resolution",
      value: "2.7 days",
      change: "0.4 days",
      trend: "down",
    },
    {
      id: "sla-compliance",
      label: "SLA Compliance",
      value: "92%",
      change: "2.6%",
      trend: "up",
    },
  ],
  charts: [
    {
      id: "request-volume",
      title: "Request Volume",
      description: "Monthly service demand across the institution.",
      type: "line",
      dataset: [
        { month: "Feb", requests: 168 },
        { month: "Mar", requests: 184 },
        { month: "Apr", requests: 197 },
        { month: "May", requests: 211 },
        { month: "Jun", requests: 228 },
        { month: "Jul", requests: 260 },
      ],
      takeaways: [
        "Request volume increased steadily over the last six months.",
        "July recorded the highest seeded service demand.",
      ],
    },
    {
      id: "service-mix",
      title: "Service Request Mix",
      description: "Distribution of requests by service.",
      type: "donut",
      dataset: [
        { service: "Transcript", value: 28 },
        { service: "Clearance", value: 24 },
        { service: "Course Application", value: 18 },
        { service: "Class Registration", value: 14 },
        { service: "Certificate Replacement", value: 9 },
        { service: "Attachment Letter", value: 7 },
      ],
      takeaways: [
        "Transcript and clearance requests account for over half of seeded demand.",
      ],
    },
    {
      id: "department-workload",
      title: "Department Workload",
      description: "Open work assigned to each department.",
      type: "bar",
      dataset: [
        { department: "Student Records", open: 48 },
        { department: "Finance", open: 32 },
        { department: "Admissions", open: 29 },
        { department: "Registrar", open: 18 },
        { department: "Academic Affairs", open: 16 },
      ],
      takeaways: [
        "Student Records has the largest active workload.",
        "Registrar volume is lower but includes more approval-stage work.",
      ],
    },
    {
      id: "sla-status",
      title: "SLA Status",
      description: "On-track, at-risk and overdue requests.",
      type: "stacked-bar",
      dataset: [
        { department: "Records", onTrack: 74, atRisk: 17, overdue: 9 },
        { department: "Finance", onTrack: 81, atRisk: 12, overdue: 7 },
        { department: "Admissions", onTrack: 88, atRisk: 8, overdue: 4 },
        { department: "Registrar", onTrack: 90, atRisk: 7, overdue: 3 },
      ],
      takeaways: [
        "Student Records has the highest seeded overdue share.",
      ],
    },
    {
      id: "resolution-time",
      title: "Resolution Time by Service",
      description: "Average processing time against target.",
      type: "composed",
      dataset: [
        { service: "Transcript", actual: 4.2, target: 5 },
        { service: "Clearance", actual: 2.6, target: 3 },
        { service: "Certificate", actual: 5.4, target: 5 },
        { service: "Attachment", actual: 1.6, target: 2 },
        { service: "Course", actual: 2.8, target: 3 },
        { service: "Registration", actual: 1.2, target: 1 },
      ],
      takeaways: [
        "Certificate replacement and class registration exceed their seeded targets.",
      ],
    },
    {
      id: "workflow-funnel",
      title: "Workflow Completion Funnel",
      description: "Requests moving from submission to completion.",
      type: "funnel",
      dataset: [
        { stage: "Submitted", value: 1000 },
        { stage: "Verified", value: 912 },
        { stage: "Reviewed", value: 846 },
        { stage: "Approved", value: 788 },
        { stage: "Completed", value: 752 },
      ],
      takeaways: [
        "The largest seeded drop occurs before verification is completed.",
      ],
    },
    {
      id: "approval-outcomes",
      title: "Approval Outcomes",
      description: "Approved, returned and rejected decisions.",
      type: "pie",
      dataset: [
        { outcome: "Approved", value: 82 },
        { outcome: "Returned", value: 13 },
        { outcome: "Rejected", value: 5 },
      ],
      takeaways: [
        "Most seeded requests reach approval without rejection.",
      ],
    },
    {
      id: "weekly-throughput",
      title: "Weekly Throughput",
      description: "Requests received and completed each week.",
      type: "area",
      dataset: [
        { week: "W1", received: 54, completed: 49 },
        { week: "W2", received: 61, completed: 57 },
        { week: "W3", received: 68, completed: 63 },
        { week: "W4", received: 77, completed: 70 },
      ],
      takeaways: [
        "Completion volume is rising but remains below intake.",
      ],
    },
    {
      id: "officer-performance",
      title: "Officer SLA Performance",
      description: "Seeded compliance and completed workload by officer.",
      type: "bar",
      dataset: [
        { officer: "Grace Wanjiku", compliance: 94, completed: 86 },
        { officer: "Peter Mwangi", compliance: 91, completed: 72 },
        { officer: "Amina Hassan", compliance: 96, completed: 68 },
      ],
      takeaways: [
        "All seeded officers are above 90% SLA compliance.",
      ],
    },
    {
      id: "request-age",
      title: "Open Request Age",
      description: "Age distribution of unresolved requests.",
      type: "bar",
      dataset: [
        { age: "0–1 day", value: 62 },
        { age: "2–3 days", value: 31 },
        { age: "4–5 days", value: 14 },
        { age: "6+ days", value: 7 },
      ],
      takeaways: [
        "Most open seeded requests are less than two days old.",
      ],
    },
  ],
  insights: [
    "Student Records carries the largest seeded workload.",
    "Certificate replacement and class registration require closer SLA monitoring.",
    "Overall completion and SLA compliance remain above 90%.",
  ],
} satisfies DemoReportConfig;
