import {
  ADMIN_ROUTE_HREFS,
} from "./admin-navigation-contract";

export type AdminWorkflowOverviewTab =
  | "templates"
  | "active";

export type AdminWorkflowRouteSearchParams = Readonly<{
  view?: string | string[];
  tab?: string | string[];
  template?: string | string[];
}>;

export type AdminWorkflowRouteSurface =
  | Readonly<{
      kind: "builder";
      initialTemplateId?: string;
    }>
  | Readonly<{
      kind: "overview";
      initialTab: AdminWorkflowOverviewTab;
    }>;

function firstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function buildAdminWorkflowBuilderHref(
  templateId?: string,
): string {
  const normalizedTemplateId = templateId?.trim();

  if (!normalizedTemplateId) {
    return ADMIN_ROUTE_HREFS.workflowBuilder;
  }

  const searchParams = new URLSearchParams({
    template: normalizedTemplateId,
  });

  return `${ADMIN_ROUTE_HREFS.workflowBuilder}?${searchParams.toString()}`;
}

export function buildAdminWorkflowOverviewHref(
  tab?: AdminWorkflowOverviewTab,
): string {
  const searchParams = new URLSearchParams({
    view: "overview",
  });

  if (tab) {
    searchParams.set("tab", tab);
  }

  return `${ADMIN_ROUTE_HREFS.workflowBuilder}?${searchParams.toString()}`;
}

export function resolveAdminWorkflowRouteSurface(
  searchParams: AdminWorkflowRouteSearchParams,
): AdminWorkflowRouteSurface {
  const view = firstSearchParam(searchParams.view);
  const rawTab = firstSearchParam(searchParams.tab);
  const templateId = firstSearchParam(
    searchParams.template,
  )?.trim();

  const initialTab: AdminWorkflowOverviewTab =
    rawTab === "active" ? "active" : "templates";

  /**
   * Compatibility:
   * Older overview bookmarks used ?tab=templates or ?tab=active without a
   * view parameter. Preserve them as overview destinations.
   */
  if (
    view === "overview" ||
    rawTab === "templates" ||
    rawTab === "active"
  ) {
    return {
      kind: "overview",
      initialTab,
    };
  }

  return {
    kind: "builder",
    ...(templateId
      ? { initialTemplateId: templateId }
      : {}),
  };
}
