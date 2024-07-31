import {
  Audit as prismaAudit,
  Stakeholder as prismaStakeholder,
  Resource as prismaResource,
  Scope as prismaScope,
  Employee as prismaEmployee,
  Person as prismaPerson,
  Company as prismaCompany,
} from "@prisma/client";

import {
  AuditStatus,
  ResourceType,
  ScopeType,
  StakeholderType,
} from "@/types/enums";

type PrismaEmployee = prismaEmployee & { personalProfile: prismaPerson };
type PrismaResource = prismaResource & { employee: PrismaEmployee };

type FormatAuditDataInputs = {
  audit: prismaAudit & {
    stakeholders: (prismaStakeholder & {
      company: prismaCompany & { employees: PrismaEmployee[] };
    })[];
    resources: PrismaResource[];
    scopes: (prismaScope & { resources: PrismaResource[] })[];
  };
};

export function formatAuditData({ audit }: FormatAuditDataInputs): Audit {
  return {
    id: audit.auditId,
    auditNumber: audit.auditNumber,
    auditDescription: audit.auditDescription,
    status: AuditStatus[audit.status],
    statusDate: audit.statusDate,
    active: audit.active,
    activeDate: audit.activeDate,
    stakeholders:
      audit.stakeholders?.map((stakeholder) => ({
        id: stakeholder.stakeholderId,
        type: StakeholderType[stakeholder.type],
        company: {
          id: stakeholder.company.companyId,
          fullLegalName: stakeholder.company.fullLegalName,
          shortName: stakeholder.company.shortName,
          address: stakeholder.company.address || undefined,
          active: stakeholder.company.active,
          activeDate: stakeholder.company.activeDate,
          employees:
            stakeholder.company?.employees?.map((employee) => ({
              id: employee.employeeId,
              primaryContact: employee.primaryContact,
              position: employee.position || undefined,
              active: employee.active,
              activeDate: employee.activeDate,
              personalProfile: {
                id: employee.personId,
                firstName: employee.personalProfile.firstName,
                lastName: employee.personalProfile.lastName,
                email: employee.personalProfile.email,
                active: employee.active,
                activeDate: employee.activeDate,
              },
            })) || [],
        },
      })) || [],
    resources:
      audit.resources?.map((resource) => ({
        id: resource.resourceId,
        type: ResourceType[resource.type],
        description: resource.description || undefined,
        active: resource.active,
        activeDate: resource.activeDate,
        employee: {
          id: resource.employee.employeeId,
          primaryContact: resource.employee.primaryContact,
          position: resource.employee.position || undefined,
          active: resource.employee.active,
          activeDate: resource.employee.activeDate,
          personalProfile: {
            id: resource.employee.personId,
            firstName: resource.employee.personalProfile.firstName,
            lastName: resource.employee.personalProfile.lastName,
            email: resource.employee.personalProfile.email,
            active: resource.employee.active,
            activeDate: resource.employee.activeDate,
          },
        },
      })) || [],
    scopes:
      audit.scopes?.map((scope) => ({
        id: scope.scopeId,
        type: ScopeType[scope.type],
        description: scope.description || undefined,
        budget: scope.budget,
        active: scope.active,
        activeDate: scope.activeDate,
        resources:
          scope.resources?.map((resource) => ({
            id: resource.resourceId,
            type: ResourceType[resource.type],
            description: resource.description || undefined,
            active: resource.active,
            activeDate: resource.activeDate,
            employee: {
              id: resource.employee.employeeId,
              primaryContact: resource.employee.primaryContact,
              position: resource.employee.position || undefined,
              active: resource.employee.active,
              activeDate: resource.employee.activeDate,
              personalProfile: {
                id: resource.employee.personId,
                firstName: resource.employee.personalProfile.firstName,
                lastName: resource.employee.personalProfile.lastName,
                email: resource.employee.personalProfile.email,
                active: resource.employee.active,
                activeDate: resource.employee.activeDate,
              },
            },
          })) || [],
      })) || [],
  };
}
