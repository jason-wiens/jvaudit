import { AuditStatus } from "@prisma/client";

export function canAccessIrFunctionality(status: AuditStatus): boolean {
  switch (status) {
    case AuditStatus.CREATED:
    case AuditStatus.CLOSED:
    case AuditStatus.CANCELLED:
    case AuditStatus.RESPONSE:
    case AuditStatus.SUBMITTED:
      return false;
    default:
      return true;
  }
}
