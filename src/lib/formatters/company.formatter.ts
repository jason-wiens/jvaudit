import {
  Company as prismaCompany,
  Employee as prismaEmployee,
  Person as prismaPerson,
} from "@prisma/client";

type FormatCompanyDataInputs = {
  company: prismaCompany & {
    employees: (prismaEmployee & { personalProfile: prismaPerson })[];
  };
};

export function formatCompanyData({
  company,
}: FormatCompanyDataInputs): Company {
  return {
    id: company.companyId,
    fullLegalName: company.fullLegalName,
    shortName: company.shortName,
    address: company.address || undefined,
    employees:
      company.employees?.map((employee) => ({
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
    active: company.active,
    activeDate: company.activeDate,
  };
}
