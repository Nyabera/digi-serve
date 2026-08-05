import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function PortalSettingsPage() {
  return (
    <AdminRouteSurface
      section="Organization"
      title="Portal Settings"
      description="Configure the institution’s public service portal behavior, visibility, and applicant-facing defaults."
      route="/demo/admin/portal-settings"
      capabilities={[
        "Review portal visibility",
        "Inspect applicant-facing defaults",
        "Prepare controlled portal changes",
      ]}
    />
  );
}
