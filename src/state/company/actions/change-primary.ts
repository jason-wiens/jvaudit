"use server";

import prisma from "@lib/db";
import type { ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { revalidatePath } from "next/cache";
import { logAction, logError } from "@/lib/logging";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

type ChangePrimaryContactInputs = {
  employeeId: string;
  companyId: string;
};

export async function changePrimaryContact({
  employeeId,
  companyId,
}: ChangePrimaryContactInputs): Promise<ServerActionResponse> {
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
    return handleServerError({
      error,
      message: "Failed to delete / deactivate company",
      user: session.user,
    });
  } finally {
    revalidatePath(AppRoutes.Company(), "page");
  }
}
