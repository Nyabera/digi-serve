import type { DemoOrganizationConfig } from "../../features/demo-engine/config";

export const tvetOrganizationDraft = {
  id: "savannah-technical-college",
  name: "Savannah Technical College",
  shortName: "Savannah",
  initials: "STC",
  organizationType: "technical-college",
  address: "Demo address",
  email: "demo@savannah.example",
  telephone: "+254 700 000 000",
  website: "https://example.invalid",
} satisfies DemoOrganizationConfig;
