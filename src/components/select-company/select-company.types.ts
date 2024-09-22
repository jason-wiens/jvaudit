import { Employee, Person, Company as PrismaCompany } from "@prisma/client";

export type Company = PrismaCompany & {
  employees: (Employee & { personalProfile: Person })[];
};
