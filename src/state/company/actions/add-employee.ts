"use server";

import { Prisma } from "@prisma/client";
import prisma from "@lib/db";
import {
  createEmployeeSchema,
  AddEmployeeFormInputs,
} from "@/schemas/employee.schema";
import {
  createPersonSchema,
  AddPersonFormInputs,
} from "@/schemas/person.schema";
import type { ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { serializeZodError } from "@/lib/utils";
import { logAction, logError } from "@/lib/logging";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

export async function addEmployee(
  inputs: AddEmployeeFormInputs & AddPersonFormInputs & { companyId: string }
): Promise<
  ServerActionResponse<AddEmployeeFormInputs & AddPersonFormInputs, void>
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
  const validatedInputs = createEmployeeSchema
    .merge(createPersonSchema)
    .safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  const { email, position, firstName, lastName } = validatedInputs.data;

  // add employee
  try {
    await prisma.$transaction(async (prisma) => {
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
          primaryContact: false,
          personId: person.personId,
          companyId: inputs.companyId,
          tenantId,
        },
      });
    });
    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "add",
      message: `Added Employee: ${firstName} ${lastName}`,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          formErrors: [
            {
              field: "email",
              message: "An employee with that email already exists.",
            },
          ],
        };
      }
    }
    return handleServerError({
      error,
      message: "Failed to add Employee",
      user: session.user,
    });
  } finally {
    revalidatePath(AppRoutes.Company(), "page");
  }
}
