import type {
  DemoWorkspaceRole,
} from "./demo-route-registry";

export const DEMO_ROLE_STORAGE_KEY =
  "faidia-demo-role";
export const DEMO_PATH_STORAGE_KEY =
  "faidia-demo-path";
export const DEMO_NAVIGATION_EVENT =
  "faidia:demo-navigation-state";

export type DemoNavigationState = {
  readonly role: DemoWorkspaceRole | null;
  readonly pathname: string;
};

export function demoRoleRouteStorageKey(
  role: DemoWorkspaceRole,
): string {
  return `faidia-demo-last-route:${role}`;
}
