"use server";

import { Prisma, User } from "@prisma/client";
import prisma from "@lib/db";
import { updateUserSchema, UpdateUserFormInputs } from "@/schemas/user.schema";
import type { FormError, ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { cleanUndefinedFields, serializeZodError } from "@/lib/utils";
import { logError, logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";
import { AppRoutes } from "@/lib/routes.app";
import { handleServerError } from "@/lib/handle-server-errors";

export async function updateUser(inputs: {
  userId: User["userId"];
  userData: UpdateUserFormInputs;
}): Promise<ServerActionResponse<UpdateUserFormInputs, { password: string }>> {
  const { userId, userData: formInputs } = inputs;
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
  const schema = updateUserSchema;
  const validatedInputs = schema.safeParse(formInputs);
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
    avatarUrl,
    primaryContact,
    admin,
  } = validatedInputs.data;

  const userData = cleanUndefinedFields({
    avatarUrl,
    admin,
  });
  const employeeData = cleanUndefinedFields({
    position,
    primaryContact,
  });
  const personData = cleanUndefinedFields({
    email,
    firstName,
    lastName,
  });

  // add user
  try {
    const user = await prisma.user.update({
      where: {
        userId: userId,
        tenantId,
      },
      // @ts-ignore
      data: {
        ...userData,
        profile: {
          update: {
            ...employeeData,
            personalProfile: {
              update: {
                ...personData,
              },
            },
          },
        },
      },
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "update",
      message: `User succesfully updated, UserId: ${inputs.userId}`,
    });
    return { success: true };
  } catch (error) {
    return handleServerError({
      user: session.user,
      error,
      message: "Failed to add user",
    });
  } finally {
    revalidatePath(AppRoutes.Users(), "page");
  }
}
