import { savannahTechnicalCollegeConfig } from "@/config/demo/clients/savannah-technical-college";
import type { DemoClientConfig } from "@/types/demo/client-config";

export const DEFAULT_DEMO_CLIENT_SLUG = "savannah-technical-college";

export const DEMO_CLIENTS: Readonly<Record<string, DemoClientConfig>> = {
  [savannahTechnicalCollegeConfig.organization.slug]:
    savannahTechnicalCollegeConfig,
};

export function listDemoClients(): DemoClientConfig[] {
  return Object.values(DEMO_CLIENTS);
}

export function getDemoClient(
  slug: string = DEFAULT_DEMO_CLIENT_SLUG,
): DemoClientConfig {
  const client = DEMO_CLIENTS[slug];

  if (!client) {
    throw new Error(`Unknown Demo Engine client: ${slug}`);
  }

  return client;
}

export function getDefaultDemoClient(): DemoClientConfig {
  return getDemoClient(DEFAULT_DEMO_CLIENT_SLUG);
}
