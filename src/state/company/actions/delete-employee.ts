"use server";

import prisma from "@lib/db";
import type { ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { revalidatePath } from "next/cache";
import { logError, logAction } from "@/lib/logging";
import { AppRoutes } from "@/lib/routes.app";
import { handleServerError } from "@/lib/handle-server-errors";

export async function deleteEmployee(
  employeeId: string
): Promise<ServerActionResponse> {
  // check permissions
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // update employee
  try {
    await prisma.employee.update({
      where: { employeeId, tenantId },
      data: {
        active: false,
        activeDate: new Date(),
      },
    });
    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "delete",
      message: `Successfully deleted employee: ${employeeId}`,
    });

    return { success: true };
  } catch (error) {
    return handleServerError({
      error,
      message: "Failed to delete employee",
      user: session.user,
    });
  } finally {
    revalidatePath(AppRoutes.Company(), "page");
  }
}
