"use server";

import { Prisma } from "@prisma/client";
import prisma from "@lib/db";
import {
  updateEmployeeSchema,
  UpdateEmployeeFormInputs,
} from "@/schemas/employee.schema";
import {
  updatePersonSchema,
  UpdatePersonFormInputs,
} from "@/schemas/person.schema";
import type { ServerActionResponse } from "@/types/types";
import { checkAuthAndPermissions } from "@/permissions/check-permissions";
import { Role } from "@prisma/client";
import { serializeZodError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { cleanUndefinedFields } from "@/lib/utils";
import { logAction, logError } from "@/lib/logging";
import { log } from "console";

export async function updateEmployee(
  employeeId: string,
  inputs: UpdateEmployeeFormInputs & UpdatePersonFormInputs
): Promise<
  ServerActionResponse<UpdateEmployeeFormInputs & UpdatePersonFormInputs>
> {
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
  const validatedInputs = updateEmployeeSchema
    .merge(updatePersonSchema)
    .safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  const { email, position, firstName, lastName, primaryContact } =
    validatedInputs.data;

  const updateEmployeeInputs = cleanUndefinedFields({
    position,
    primaryContact,
  });
  const updatePersonInputs = cleanUndefinedFields({
    email,
    firstName,
    lastName,
  });

  // update employee
  try {
    await prisma.employee.update({
      where: { employeeId: employeeId, tenantId },
      data: {
        ...updateEmployeeInputs,
        personalProfile: {
          update: updatePersonInputs,
        },
      },
      include: {
        personalProfile: true,
      },
    });
    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "update",
      message: `Successfully updated employee: ${employeeId}`,
    });
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        logError({
          timestamp: new Date(),
          user: session.user,
          message: `Tried changing email to an email that already exists: ${email}`,
          error,
        });
        return {
          success: false,
          message: "The email is already in use",
        };
      }
    }
    logError({
      timestamp: new Date(),
      user: session.user,
      message: `An error occurred while updating employee: ${employeeId}`,
      error,
    });
    return {
      success: false,
      message: "An error occurred while adding the company",
    };
  }
}
