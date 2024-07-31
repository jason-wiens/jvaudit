type Person = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  activeDate: Date;
};

type Company = {
  id: string;
  fullLegalName: string;
  shortName: string;
  address?: string;
  employees: CompanyEmployee[];
  active: boolean;
  activeDate: Date;
};

type CompanyEmployee = Omit<Employee, "employerProfile">;

type Employee = {
  id: string;
  primaryContact: boolean;
  position?: string;
  personalProfile: Person;
  employerProfile: Company;
  active: boolean;
  activeDate: Date;
};

type Audit = {
  id: string;
  auditNumber: string;
  auditDescription: string;
  status: AuditStatus;
  statusDate: Date;
  active: boolean;
  activeDate: Date;
  stakeholders: AuditStakeholder[];
  resources: AuditResource[];
  scopes: AuditScope[];
};

type Stakeholder = {
  id: string;
  type: StakeholderType;
  company: Company;
  audit: Audit;
};

type AuditStakeholder = Omit<Stakeholder, "audit">;

type Resource = {
  id: string;
  type: ResourceType;
  description?: string;
  active: boolean;
  activeDate: Date;
  employee: CompanyEmployee;
  audit: Audit;
  assignedTo: Scope;
};

type AuditResource = Omit<Resource, "audit" | "assignedTo">;

type Scope = {
  id: string;
  type: ScopeType;
  description?: string;
  budget: number;
  active: boolean;
  activeDate: Date;
  audit: Audit;
  resources: AuditResource[];
};

type AuditScope = Omit<Scope, "audit">;

enum AuditStatus {
  CREATED = "CREATED",
  CONFIRMED = "CONFIRMED",
  PREPERATION = "PREPERATION",
  FIELDWORK = "FIELDWORK",
  REPORTING = "REPORTING",
  SUBMITTED = "SUBMITTED",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
}

enum ResourceType {
  AUDITOR = "AUDITOR",
  PRIMARY_CONTACT_OPERATOR = "PRIMARY_CONTACT_OPERATOR",
  PRIMARY_CONTACT_LEAD = "PRIMARY_CONTACT_LEAD",
  AUDIT_CONTACT_OPERATOR = "AUDIT_CONTACT_OPERATOR",
  AUDIT_CONTACT_NON_OPERATOR = "AUDIT_CONTACT_NON_OPERATOR",
  MANAGER = "MANAGER",
  OBSERVER = "OBSERVER",
}

enum ScopeType {
  CAPITAL_EXPENDITURES = "CAPITAL_EXPENDITURES",
  OPERATING_EXPENSES = "OPERATING_EXPENSES",
  PRODUCTION_ALLOCATIONS = "PRODUCTION_ALLOCATIONS",
  EQUALIZATIONS = "EQUALIZATIONS",
  FEES = "FEES",
  FEE_INCOME = "FEE_INCOME",
  MARKETING = "MARKETING",
  MANAGEMENT = "MANAGEMENT",
  ADMINISTRATION = "ADMINISTRATION",
}

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_USER = "SUPER_USER",
}

enum StakeholderType {
  OPERATOR = "OPERATOR",
  AUDIT_LEAD = "AUDIT_LEAD",
  AUDIT_PARTICIPANT = "AUDIT_PARTICIPANT",
  NON_OP_OWNER = "NON_OP_OWNER",
  SERVICE_PROVIDER = "SERVICE_PROVIDER",
}
