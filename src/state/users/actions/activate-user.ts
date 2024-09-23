"use server";

import { User } from "@prisma/client";
import prisma from "@lib/db";
import type { ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { logError, logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";
import { isValidUUID } from "@/lib/utils";
import { AppRoutes } from "@/lib/routes.app";
import { handleServerError } from "@/lib/handle-server-errors";

export async function activateUser(inputs: {
  userId: User["userId"];
}): Promise<ServerActionResponse> {
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

  // add user
  try {
    const user = await prisma.user.update({
      where: {
        userId: inputs.userId,
        tenantId,
      },
      data: {
        active: true,
        activeDate: new Date(),
      },
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "update",
      message: `User ${user.username} has successfully been activated`,
    });
    revalidatePath(AppRoutes.Users(), "page");
    return { success: true };
  } catch (error) {
    return handleServerError({
      user: session.user,
      error,
      message: "Failed to activate user",
    });
  } finally {
    revalidatePath(AppRoutes.Users(), "page");
  }
}
