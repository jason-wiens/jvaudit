import { StakeholderType } from "@prisma/client";

export function formatStakeholderType(type: StakeholderType) {
  switch (type) {
    case StakeholderType.AUDIT_LEAD:
      return "Audit Lead";
    case StakeholderType.OPERATOR:
      return "Operator";
    case StakeholderType.SERVICE_PROVIDER:
      return "Service Provider";
    case StakeholderType.AUDIT_PARTICIPANT:
      return "Audit Participant";
    case StakeholderType.NON_OP_OWNER:
      return "Non-Operating Owner";
    default:
      return "Unknown";
  }
}
