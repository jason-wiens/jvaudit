"use server";

import { Prisma } from "@prisma/client";
import prisma from "@lib/db";
import {
  createCompanySchema,
  AddCompanyFormInputs,
} from "@/schemas/company.schema";
import {
  createEmployeeSchema,
  AddEmployeeFormInputs,
} from "@/schemas/employee.schema";
import {
  createPersonSchema,
  AddPersonFormInputs,
} from "@/schemas/person.schema";
import type { FormError, ServerActionResponse } from "@/types/types";
import { checkAuthAndPermissions } from "@/permissions/check-permissions";
import { Role } from "@prisma/client";
import { serializeZodError } from "@/lib/utils";
import { logError, logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";

type AddCompanyInputs = AddCompanyFormInputs &
  AddEmployeeFormInputs &
  AddPersonFormInputs;

export async function addCompany(
  inputs: AddCompanyInputs
): Promise<ServerActionResponse<AddCompanyInputs>> {
  // check permissions
  const session = await checkAuthAndPermissions({
    accessLevelRequired: Role.ADMIN,
  });
  if (!session) {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }
  const tenantId = session.user.tenantId;

  // validate inputs
  const schema = createCompanySchema
    .merge(createEmployeeSchema)
    .merge(createPersonSchema);
  const validatedInputs = schema.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  const {
    email,
    position,
    firstName,
    lastName,
    fullLegalName,
    shortName,
    address,
  } = validatedInputs.data;

  // add company
  try {
    await prisma.$transaction(async (prisma) => {
      const company = await prisma.company.create({
        data: {
          fullLegalName,
          shortName,
          address,
          tenantId,
        },
      });

      const person = await prisma.person.create({
        data: {
          email,
          firstName,
          lastName,
          tenantId,
        },
      });

      await prisma.employee.create({
        data: {
          position,
          primaryContact: true,
          personId: person.personId,
          companyId: company.companyId,
          tenantId,
        },
      });
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "add",
      message: `Company added: ${validatedInputs.data.fullLegalName}`,
    });
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const uniqueConstraint = (error.meta?.target as string[]) || [];
        const formErrors: FormError<AddCompanyFormInputs>[] = [];
        if (uniqueConstraint.includes("shortName")) {
          formErrors.push({
            field: "shortName",
            message: "Short name already exists",
          });
        }
        if (uniqueConstraint.includes("fullLegalName")) {
          formErrors.push({
            field: "fullLegalName",
            message: "Full legal name already exists",
          });
        }
        logError({
          timestamp: new Date(),
          user: session.user,
          error,
          message: `Error adding company, violated unique constraints: ${uniqueConstraint.join(
            ", "
          )}`,
        });
        return {
          success: false,
          formErrors,
        };
      }
    }
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message: `Unable to create company: ${validatedInputs.data.fullLegalName}`,
    });
    return {
      success: false,
      message: "An error occurred while adding the company",
    };
  }
}
