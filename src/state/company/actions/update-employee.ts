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
import { checkAdmin } from "@/permissions";
import { serializeZodError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { cleanUndefinedFields } from "@/lib/utils";
import { logAction, logError } from "@/lib/logging";
import { log } from "console";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

type UpdateEmployeeInputs = {
  employeeId: string;
  employeeData: UpdateEmployeeFormInputs & UpdatePersonFormInputs;
};

export async function updateEmployee({
  employeeId,
  employeeData,
}: UpdateEmployeeInputs): Promise<
  ServerActionResponse<UpdateEmployeeFormInputs & UpdatePersonFormInputs>
> {
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
  const validatedInputs = updateEmployeeSchema
    .merge(updatePersonSchema)
    .safeParse(employeeData);
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
        return {
          success: false,
          message: "The email is already in use",
        };
      }
    }
    return handleServerError({
      error,
      message: "Failed to update employee",
      user: session.user,
    });
  } finally {
    revalidatePath(AppRoutes.Company(), "page");
  }
}
