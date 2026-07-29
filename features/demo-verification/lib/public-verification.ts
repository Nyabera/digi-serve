import type {
  DemoPublicVerificationRecordConfig,
  DemoVerificationConfig,
} from "@/features/demo-engine/config";

export function normalizeVerificationValue(value: string): string {
  return value.trim().replace(/\s+/g, "").toUpperCase();
}

export function findPublicVerificationRecord(
  verification: DemoVerificationConfig,
  value: string,
): DemoPublicVerificationRecordConfig | undefined {
  const normalized = normalizeVerificationValue(value);
  return verification.records.find(
    (record) =>
      normalizeVerificationValue(record.verificationCode) === normalized ||
      normalizeVerificationValue(record.token) === normalized,
  );
}

export function createPublicVerificationLink(
  origin: string,
  verificationCode: string,
): string {
  const query = new URLSearchParams({ code: verificationCode });
  return `${origin}/demo/verify-certificate?${query.toString()}`;
}
