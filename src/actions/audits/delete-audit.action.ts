"use server";

import prisma from "@lib/db";
import type { ServerActionResponse } from "@/types/types";
import { checkAuthAndPermissions } from "@/permissions/check-permissions";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { logError, logAction } from "@/lib/logging";

type DeleteAuditInputs = {
  auditId: string;
};

export async function deleteAudit({
  auditId,
}: DeleteAuditInputs): Promise<ServerActionResponse> {
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

  try {
    // check if audit exists
    const audit = await prisma.audit.findFirst({
      where: { auditId, tenantId },
    });

    // if audit status is CREATED then delete, else set active to false
    if (!!audit && audit.status === "CREATED") {
      await prisma.audit.delete({
        where: { auditId, tenantId },
      });
    } else {
      await prisma.audit.update({
        where: { auditId, tenantId },
        data: {
          active: false,
          activeDate: new Date(),
        },
      });
    }

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "delete",
      message: `Audit deleted: ${audit?.auditNumber || "unknown"}`,
    });
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message: `Error deleting company: ${auditId}`,
    });
    return {
      success: false,
      message: "An error occurred while deleting the audit",
    };
  }
}
