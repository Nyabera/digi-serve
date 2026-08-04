import { departmentHandoffsReference } from "@/features/demo-engine/fixtures/department-handoffs.reference";
import type { DepartmentInboxModel } from "@/features/department-handoffs/model/department-handoff-model";

export function getDemoDepartmentHandoffsReference(): DepartmentInboxModel {
  return departmentHandoffsReference;
}
