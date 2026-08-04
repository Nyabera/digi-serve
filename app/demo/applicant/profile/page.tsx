import type {
  Metadata,
} from "next";

import {
  ApplicantProfilePage,
} from "@/features/demo-applicant/components/applicant-profile-page";

export const metadata: Metadata = {
  title: "Applicant Profile | FAIDIA Demo",
  description:
    "Review applicant information, preferences and security settings.",
};

export default function ApplicantProfileRoute() {
  return <ApplicantProfilePage />;
}
