import { WorkflowOverview } from "@/features/demo-admin-workflows/components/workflow-overview";

type WorkflowOverviewPageProps = {
  searchParams: Promise<{
    tab?: string | string[];
  }>;
};

export default async function WorkflowOverviewPage({
  searchParams,
}: WorkflowOverviewPageProps) {
  const resolved = await searchParams;
  const rawTab = Array.isArray(resolved.tab) ? resolved.tab[0] : resolved.tab;

  return (
    <WorkflowOverview
      initialTab={rawTab === "active" ? "active" : "templates"}
    />
  );
}
