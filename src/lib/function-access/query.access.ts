import { AuditStatus } from "@prisma/client";

export function canAccessQueryFunctionality(status: AuditStatus): boolean {
  switch (status) {
    case AuditStatus.REPORTING:
      return true;
    default:
      return false;
  }
}
