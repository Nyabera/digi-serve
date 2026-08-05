import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function BrandingPage() {
  return (
    <AdminRouteSurface
      section="Organization"
      title="Branding"
      description="Control the approved logo, colors, and institution identity used across the public portal and workspaces."
      route="/demo/admin/branding"
      capabilities={[
        "Review active brand assets",
        "Inspect visual identity settings",
        "Prepare controlled branding changes",
      ]}
    />
  );
}
