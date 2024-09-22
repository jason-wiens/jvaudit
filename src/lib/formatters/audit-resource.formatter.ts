import { ResourceType } from "@prisma/client";

export function formatResourceType(type: ResourceType) {
  switch (type) {
    case ResourceType.AUDITOR:
      return "Auditor";
    case ResourceType.AUDIT_CONTACT_NON_OPERATOR:
      return "Contact (Non-Op)";
    case ResourceType.AUDIT_CONTACT_OPERATOR:
      return "Audit Contact";
    case ResourceType.MANAGER:
      return "Manager";
    case ResourceType.OBSERVER:
      return "Observer";
    default:
      return "Unknown";
  }
}
