import type {
  DemoVerificationConfig,
} from "../../features/demo-engine/config";

export const tvetVerificationDraft = {
  defaultCode: "STC-2026-7J4K8M2P",
  privacyNotice:
    "Personal information is partially masked to protect the certificate holder.",
  disclaimer:
    "Verification confirms the current institutional record. It does not replace inspection of the original certificate or other due-diligence checks.",
  records: [
    {
      token: "stc-vfy-2026-7j4k8m2p",
      verificationCode: "STC-2026-7J4K8M2P",
      status: "valid",
      institution: "Savannah Technical College",
      issuingOffice: "Office of the Registrar",
      documentType:
        "Diploma in Information Communication Technology",
      maskedHolderName: "JO•••• MO••••",
      certificateReference: "STC/DIP/ICT/2026/0148",
      issuedAt: "2026-07-18T09:00:00+03:00",
      verifiedAt: "2026-07-28T16:42:00+03:00",
      publicNote:
        "This record matches a certificate currently held by Savannah Technical College.",
    },
    {
      token: "stc-vfy-2025-rvk7n2q4",
      verificationCode: "STC-2025-RVK7N2Q4",
      status: "revoked",
      institution: "Savannah Technical College",
      issuingOffice: "Office of the Registrar",
      documentType: "Certificate in Electrical Installation",
      maskedHolderName: "AM•••• KA••••",
      certificateReference: "STC/CERT/EI/2025/0082",
      issuedAt: "2025-11-14T09:00:00+03:00",
      verifiedAt: "2026-07-28T16:42:00+03:00",
      publicNote:
        "The institution has revoked this document. Contact the issuing office through a verified channel.",
    },
    {
      token: "stc-vfy-2022-exp4h8t1",
      verificationCode: "STC-2022-EXP4H8T1",
      status: "expired",
      institution: "Savannah Technical College",
      issuingOffice: "Professional Certification Office",
      documentType: "Occupational Safety Competency Certificate",
      maskedHolderName: "PE•••• NW••••",
      certificateReference: "STC/PRO/OSC/2022/0314",
      issuedAt: "2022-08-22T09:00:00+03:00",
      verifiedAt: "2026-07-28T16:42:00+03:00",
      publicNote:
        "The qualification record is genuine, but its validity period has ended.",
    },
    {
      token: "stc-vfy-2024-rpl9m3k2",
      verificationCode: "STC-2024-RPL9M3K2",
      status: "replaced",
      institution: "Savannah Technical College",
      issuingOffice: "Student Records Office",
      documentType: "Diploma in Automotive Engineering",
      maskedHolderName: "BR•••• OT••••",
      certificateReference: "STC/DIP/AE/2024/0191",
      issuedAt: "2024-12-06T09:00:00+03:00",
      verifiedAt: "2026-07-28T16:42:00+03:00",
      replacementReference: "STC/DIP/AE/2026/0049",
      publicNote:
        "This document was replaced. Use the replacement reference for subsequent verification.",
    },
  ],
} satisfies DemoVerificationConfig;
