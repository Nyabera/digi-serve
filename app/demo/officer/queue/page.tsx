import { OfficerTasksWorkspace } from "@/features/demo-operations";

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function OfficerQueuePage({
  searchParams,
}: PageProps) {
  const resolved = searchParams ? await searchParams : {};
  const rawFilter = resolved.filter ?? resolved.status ?? resolved.due;
  const filter = Array.isArray(rawFilter) ? rawFilter[0] : rawFilter;

  return <OfficerTasksWorkspace initialFilter={filter} />;
}
