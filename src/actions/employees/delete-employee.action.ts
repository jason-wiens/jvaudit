"use server";

import prisma from "@lib/db";
import type { ServerActionResponse } from "@/types/types";
import { checkAuthAndPermissions } from "@/permissions/check-permissions";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { logError, logAction } from "@/lib/logging";

export async function deleteEmployee(
  employeeId: string
): Promise<ServerActionResponse> {
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
    logError({
      timestamp: new Date(),
      user: session.user,
      message: `Error deleting employee: ${employeeId}`,
      error,
    });
    return {
      success: false,
      message: "An error occurred while adding the company",
    };
  } finally {
    revalidatePath("/admin", "layout");
  }
}
