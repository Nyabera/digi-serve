import type {
  DemoApplicantProfileConfig,
} from "../../features/demo-engine/config";

export const tvetApplicantProfileDraft = {
  id: "savannah-default-applicant",
  fullName: "Brian Otieno",
  preferredName: "Brian",
  roleLabel: "Applicant",
  studentNumber: "STC-AP-2025-01478",
  email: "brian.otieno@example.com",
  phone: "+254 712 555 018",
  alternatePhone: "+254 733 555 014",
  dateOfBirth: "2002-04-12T00:00:00+03:00",
  gender: "Male",
  nationality: "Kenyan",
  maritalStatus: "Single",
  homeAddress:
    "Ngong Road, Nairobi, Kenya",
  programme:
    "Diploma in Information Communication Technology",
  department:
    "Computing and Informatics",
  campus:
    "Savannah Main Campus",
  intake:
    "September 2025",
  yearOfStudy:
    "Year 1",
  expectedCompletion:
    "2027-05-31T00:00:00+03:00",
  profileCompletion: 85,
  verification: {
    emailVerifiedAt:
      "2026-05-12T10:00:00+03:00",
    phoneVerifiedAt:
      "2026-05-12T10:05:00+03:00",
    studentRecordMatchedAt:
      "2026-05-12T10:10:00+03:00",
  },
  communicationPreferences: {
    emailNotifications: true,
    smsNotifications: true,
    inAppNotifications: true,
    requestUpdates: true,
    paymentConfirmations: true,
    documentIssuedAlerts: true,
  },
  security: {
    twoFactorEnabled: true,
    activeSessions: 2,
  },
} satisfies DemoApplicantProfileConfig;
