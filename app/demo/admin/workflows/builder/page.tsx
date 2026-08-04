import { WorkflowBuilder } from "@/features/demo-admin-workflows/components/workflow-builder";

type WorkflowBuilderPageProps = {
  searchParams: Promise<{
    template?: string | string[];
  }>;
};

export default async function WorkflowBuilderPage({
  searchParams,
}: WorkflowBuilderPageProps) {
  const resolved = await searchParams;
  const template = Array.isArray(resolved.template)
    ? resolved.template[0]
    : resolved.template;

  return (
    <WorkflowBuilder
      initialTemplateId={template ?? "transcript-request"}
    />
  );
}
