import {
  AuditStatus,
  ResourceType,
  WorkspaceType,
  ScopeType,
  StakeholderType,
} from "@prisma/client";

export const beautifyEnumTerm = (
  term: AuditStatus | ResourceType | WorkspaceType | ScopeType | StakeholderType
) => {
  switch (term) {
    case "CREATED":
      return "Created";
    case "CONFIRMED":
      return "Confirmed";
    case "FIELDWORK":
      return "Fieldwork";
    case "REPORTING":
      return "Reporting";
    case "SUBMITTED":
      return "Submitted";
    case "RESPONSE":
      return "Response";
    case "CLOSED":
      return "Closed";
    case "CANCELLED":
      return "Cancelled";
    case "AUDITOR":
      return "Auditor";
    case "AUDIT_CONTACT_OPERATOR":
      return "Audit Contact";
    case "AUDIT_CONTACT_NON_OPERATOR":
      return "Contact";
    case "MANAGER":
      return "Manager";
    case "OBSERVER":
      return "Observer";
    case "CAPITAL_EXPENDITURES":
      return "Capital Expenditures";
    case "OPERATING_EXPENSES":
      return "Operating Expenses";
    case "PRODUCTION_ALLOCATIONS":
      return "Production Allocations";
    case "EQUALIZATIONS":
      return "Equalizations";
    case "FEES":
      return "Fees";
    case "FEE_INCOME":
      return "Fee Income";
    case "MARKETING":
      return "Marketing";
    case "MANAGEMENT":
      return "Management";
    case "ADMINISTRATION":
      return "Administration";
    case "OPERATOR":
      return "Operator";
    case "AUDIT_LEAD":
      return "Audit Lead";
    case "AUDIT_PARTICIPANT":
      return "Audit Participant";
    case "NON_OP_OWNER":
      return "Non-Operator Owner";
    case "SERVICE_PROVIDER":
      return "Service Provider";
    case "INCOMING":
      return "Incoming";
    case "OUTGOING":
      return "Outgoing";
    case "INTERNAL":
      return "Internal";
    default:
      return term;
  }
};
