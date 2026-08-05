import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function QRVerificationPage() {
  return (
    <AdminRouteSurface
      section="Documents"
      title="QR Verification"
      description="Manage public verification references and review how issued documents are validated."
      route="/demo/admin/qr-verification"
      capabilities={[
        "Review verification references",
        "Inspect validity and revocation state",
        "Prepare public verification controls",
      ]}
    />
  );
}
