import type { DemoPack } from "../../features/demo-engine/config";

import { tvetBrandingDraft } from "./branding";
import { tvetDepartmentsDraft } from "./departments";
import { tvetDocumentsDraft } from "./documents";
import { tvetApplicantProfileDraft } from "./applicant-profile";
import { tvetHomepageDraft } from "./homepage";
import { tvetOrganizationDraft } from "./organization";
import { tvetReportsDraft } from "./reports";
import { tvetRequestsDraft } from "./requests";
import { tvetServicesDraft } from "./services";
import { tvetSlaDraft } from "./sla";
import { tvetUsersDraft } from "./users";
import { tvetWorkflowsDraft } from "./workflows";
import { tvetVerificationDraft } from "./verification";

export const tvetDemoPackDraft = {
  id: "tvet",
  name: "TVET Demo Pack",
  version: "0.3.0-draft",
  status: "draft",
  engineCompatibility: "^1.0.0",
  defaultRoute: "/demo",
  defaultRole: "applicant",
  defaultRequestId: "STC-CL-2026-0027",
  organization: tvetOrganizationDraft,
  branding: tvetBrandingDraft,
  homepage: tvetHomepageDraft,
  departments: tvetDepartmentsDraft,
  documents: tvetDocumentsDraft,
  applicantProfile: tvetApplicantProfileDraft,
  users: tvetUsersDraft,
  services: tvetServicesDraft,
  workflows: tvetWorkflowsDraft,
  requests: tvetRequestsDraft,
  reports: tvetReportsDraft,
  sla: tvetSlaDraft,
  verification: tvetVerificationDraft,
} satisfies DemoPack;
