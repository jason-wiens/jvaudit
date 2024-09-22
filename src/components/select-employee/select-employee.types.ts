import { Employee as PrismaEmployee, Person } from "@prisma/client";

export type Employee = PrismaEmployee & { personalProfile: Person };
