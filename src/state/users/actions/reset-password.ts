"use server";

import { User } from "@prisma/client";
import prisma from "@lib/db";
import type { ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { logError, logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";
import { generateStrongPassword } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { isValidUUID } from "@/lib/utils";
import { AppRoutes } from "@/lib/routes.app";

export async function resetPassword(inputs: {
  userId: User["userId"];
}): Promise<ServerActionResponse<{}, { password: string }>> {
  // check permissions
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  if (!isValidUUID(inputs.userId)) {
    return {
      success: false,
      message: "Invalid User ID",
    };
  }

  const password = generateStrongPassword();
  const hashedPassword = await bcrypt.hash(password, 10);

  // add user
  try {
    const user = await prisma.user.update({
      where: {
        userId: inputs.userId,
        tenantId,
      },
      data: {
        password: hashedPassword,
        forcePasswordChange: true,
      },
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "update",
      message: `User ${user.username} password`,
    });
    revalidatePath(AppRoutes.Users(), "page");
    return { success: true, data: { password } };
  } catch (error) {
    const message = `Error Resetting Password for userId, ${inputs.userId}: ${
      error instanceof Error ? error.message : "Unknown Error"
    }`;
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message,
    });
    return {
      success: false,
      message,
    };
  }
}
