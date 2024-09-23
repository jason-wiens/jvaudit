"use server";

import { Prisma } from "@prisma/client";
import prisma from "@lib/db";
import { createUserSchema, AddUserFormInputs } from "@/schemas/user.schema";
import type { FormError, ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { serializeZodError } from "@/lib/utils";
import { logError, logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";
import { generateStrongPassword } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { AppRoutes } from "@/lib/routes.app";
import { handleServerError } from "@/lib/handle-server-errors";

export async function addUser(
  userData: AddUserFormInputs
): Promise<ServerActionResponse<AddUserFormInputs, { password: string }>> {
  // check permissions
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;
  const companyId = session.user.companyId;
  const defaultWorkspaceId = session.user.defaultWorkspaceId;

  // validate inputs
  const schema = createUserSchema;
  const validatedInputs = schema.safeParse(userData);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  const { email, position, firstName, lastName, username } =
    validatedInputs.data;

  const password = generateStrongPassword();
  const hashedPassword = await bcrypt.hash(password, 10);

  // add user
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

      const employee = await prisma.employee.create({
        data: {
          position,
          primaryContact: false,
          companyId,
          tenantId,
          personId: person.personId,
        },
      });

      await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          tenantId,
          profileId: employee.employeeId,
          defaultWorkspaceId,
        },
      });
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "add",
      message: `User created: ${validatedInputs.data.username}`,
    });
    return { success: true, data: { password } };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const uniqueConstraint = (error.meta?.target as string[]) || [];
        const formErrors: FormError<AddUserFormInputs>[] = [];
        if (uniqueConstraint.includes("username")) {
          formErrors.push({
            field: "username",
            message: "Username already exists",
          });
        }
        return {
          success: false,
          formErrors,
        };
      }
    }
    return handleServerError({
      user: session.user,
      error,
      message: "Failed to add user",
    });
  } finally {
    revalidatePath(AppRoutes.Users(), "page");
  }
}
