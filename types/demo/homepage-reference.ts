export interface DemoHomepageReference {
  readonly id: string;
  readonly name: string;
  readonly approvalStatus: "APPROVED";
  readonly imagePath: string;
  readonly imageAlt: string;
  readonly purpose: string;
  readonly implementationPrinciples: readonly string[];
  readonly preserve: readonly string[];
  readonly avoid: readonly string[];
}
