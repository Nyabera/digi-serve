import { describe, expect, it } from "vitest";

import {
  ADMIN_ROUTE_HREFS,
} from "../../../features/demo-engine/navigation/admin-navigation-contract";
import {
  buildAdminWorkflowBuilderHref,
  buildAdminWorkflowOverviewHref,
  resolveAdminWorkflowRouteSurface,
} from "../../../features/demo-engine/navigation/admin-workflow-route-compatibility";

describe("D34 admin workflow route compatibility", () => {
  it("uses the canonical workflow route as the default builder href", () => {
    expect(buildAdminWorkflowBuilderHref()).toBe(
      ADMIN_ROUTE_HREFS.workflowBuilder,
    );
  });

  it("preserves a selected template on the canonical builder href", () => {
    expect(
      buildAdminWorkflowBuilderHref(
        "transcript request",
      ),
    ).toBe(
      `${ADMIN_ROUTE_HREFS.workflowBuilder}?template=transcript+request`,
    );
  });

  it("builds an explicit overview destination", () => {
    expect(buildAdminWorkflowOverviewHref()).toBe(
      `${ADMIN_ROUTE_HREFS.workflowBuilder}?view=overview`,
    );
    expect(
      buildAdminWorkflowOverviewHref("active"),
    ).toBe(
      `${ADMIN_ROUTE_HREFS.workflowBuilder}?view=overview&tab=active`,
    );
  });

  it("renders the builder by default", () => {
    expect(
      resolveAdminWorkflowRouteSurface({}),
    ).toEqual({
      kind: "builder",
    });
  });

  it("passes a template to the canonical builder surface", () => {
    expect(
      resolveAdminWorkflowRouteSurface({
        template: ["course-application"],
      }),
    ).toEqual({
      kind: "builder",
      initialTemplateId: "course-application",
    });
  });

  it("renders the overview only when explicitly requested", () => {
    expect(
      resolveAdminWorkflowRouteSurface({
        view: "overview",
      }),
    ).toEqual({
      kind: "overview",
      initialTab: "templates",
    });
  });

  it("preserves old tab-only overview bookmarks", () => {
    expect(
      resolveAdminWorkflowRouteSurface({
        tab: "active",
      }),
    ).toEqual({
      kind: "overview",
      initialTab: "active",
    });
  });

  it("normalizes unknown overview tabs to templates", () => {
    expect(
      resolveAdminWorkflowRouteSurface({
        view: "overview",
        tab: "unknown",
      }),
    ).toEqual({
      kind: "overview",
      initialTab: "templates",
    });
  });
});
