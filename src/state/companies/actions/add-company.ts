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
import { checkAdmin } from "@/permissions";
import { serializeZodError } from "@/lib/utils";
import { logError, logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

type AddCompanyInputs = AddCompanyFormInputs &
  AddEmployeeFormInputs &
  AddPersonFormInputs;

export async function addCompany(
  inputs: AddCompanyInputs
): Promise<ServerActionResponse<AddCompanyInputs>> {
  // check permissions
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
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
        return {
          success: false,
          formErrors,
        };
      }
    }
    return handleServerError({
      error,
      message: "Unable to add company",
      user: session.user,
    });
  } finally {
    revalidatePath(AppRoutes.Companies(), "page");
  }
}
