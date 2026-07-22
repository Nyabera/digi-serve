import type { DemoHomepageReference } from "@/types/demo/homepage-reference";

export const PRIMARY_HOMEPAGE_REFERENCE = {
  id: "primary-homepage-reference",
  name: "Approved FAIDIA Homepage Reference",
  approvalStatus: "APPROVED",
  imagePath:
    "/demo/references/homepage/primary-homepage-reference.png",
  imageAlt:
    "Approved visual reference for the single FAIDIA Demo Engine homepage.",
  purpose:
    "This screenshot is the primary visual source for the homepage implementation built during D11.",
  implementationPrinciples: [
    "Translate the reference into reusable React components instead of displaying it as the final homepage.",
    "Use the configured organization, services and contact information.",
    "Preserve the visual hierarchy, spacing, content density and call-to-action emphasis.",
    "Adapt the layout for desktop, tablet and mobile screens.",
    "Keep homepage links inside the existing /demo journey.",
  ],
  preserve: [
    "Overall visual hierarchy",
    "Hero composition",
    "Primary and secondary call-to-action placement",
    "Section order",
    "Card structure",
    "Typography hierarchy",
    "Spacing rhythm",
    "Visual balance",
  ],
  avoid: [
    "Copying placeholder wording from the screenshot",
    "Creating additional homepage variants",
    "Adding a homepage switcher",
    "Replacing service access with marketing-only content",
    "Changing production routes",
    "Adding production Supabase dependencies",
  ],
} as const satisfies DemoHomepageReference;
