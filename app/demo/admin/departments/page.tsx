import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function DepartmentsPage() {
  return (
    <AdminRouteSurface
      section="People & Access"
      title="Departments"
      description="Maintain the departments responsible for services, work queues, approvals, and handoffs."
      route="/demo/admin/departments"
      capabilities={[
        "Review department structure",
        "Inspect operational ownership",
        "Prepare department configuration",
      ]}
    />
  );
}
