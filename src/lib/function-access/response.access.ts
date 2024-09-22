import { AuditStatus } from "@prisma/client";

export function canAccessResponseFunctionality(status: AuditStatus): boolean {
  switch (status) {
    case AuditStatus.RESPONSE:
      return true;
    default:
      return false;
  }
}
