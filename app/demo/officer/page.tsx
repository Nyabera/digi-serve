import OfficerDashboardHighFidelity from "@/features/demo-engine/dashboards/officer/high-fidelity";

export const dynamic = "force-dynamic";

const dashboardDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "Africa/Nairobi",
});

export default function OfficerDashboardPage() {
  const todayLabel = dashboardDateFormatter.format(new Date());

  return (
    <OfficerDashboardHighFidelity
      embedded
      todayLabel={todayLabel}
    />
  );
}
