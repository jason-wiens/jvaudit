"use server";

import prisma from "@lib/db";
import type { ServerActionResponse } from "@/types/types";
import { checkAuthAndPermissions } from "@/permissions/check-permissions";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { logAction, logError } from "@/lib/logging";

type ChangePrimaryContactInputs = {
  employeeId: string;
  companyId: string;
};

export async function changePrimaryContact({
  employeeId,
  companyId,
}: ChangePrimaryContactInputs): Promise<ServerActionResponse> {
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
    await prisma.$transaction(async (prisma) => {
      // set previous primary contact to false
      const currentPrimary = await prisma.employee.findFirst({
        where: {
          tenantId,
          companyId,
          primaryContact: true,
        },
      });
      if (!!currentPrimary) {
        await prisma.employee.update({
          where: {
            employeeId: currentPrimary.employeeId,
          },
          data: {
            primaryContact: false,
          },
        });
      }

      // set new primary contact to true
      await prisma.employee.update({
        where: {
          employeeId,
          companyId,
          tenantId,
        },
        data: {
          primaryContact: true,
        },
      });
    });
    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "update",
      message: "Successfully changed the primary contact",
    });
    return { success: true };
  } catch (error) {
    logError({
      timestamp: new Date(),
      user: session.user,
      message: "An error occurred while changing the primary contact",
      error,
    });
    return {
      success: false,
      message: "An error occurred while changing the primary contact",
    };
  } finally {
    revalidatePath("/admin", "layout");
  }
}
