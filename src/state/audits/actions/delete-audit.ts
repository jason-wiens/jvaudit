"use server";

import prisma from "@lib/db";
import type { ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { revalidatePath } from "next/cache";
import { logError, logAction } from "@/lib/logging";
import { Prisma } from "@prisma/client";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

type DeleteAuditInputs = {
  auditId: string;
  workspaceId: string;
};

export async function deleteAudit({
  workspaceId,
  auditId,
}: DeleteAuditInputs): Promise<ServerActionResponse> {
  // check permissions
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
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
      await prisma.$transaction(async (prisma) => {
        // 1. Update the Audit to set active: false
        await prisma.audit.update({
          where: { auditId },
          data: {
            active: false,
            activeDate: new Date(),
          },
        });

        // 2. Update all Resources associated with the Audit to set active: false
        await prisma.resource.updateMany({
          where: { auditId },
          data: {
            active: false,
            activeDate: new Date(),
          },
        });

        // 3. Update all Scopes associated with the Audit to set active: false
        await prisma.scope.updateMany({
          where: { auditId },
          data: {
            active: false,
            activeDate: new Date(),
          },
        });

        // 4. Update all IRs associated with the Audit to set active: false
        await prisma.informationRequest.updateMany({
          where: { auditId },
          data: {
            active: false,
            activeDate: new Date(),
          },
        });
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
    return handleServerError({
      error,
      message: "Failed to delete / deactivate audit",
      user: session.user,
    });
  } finally {
    revalidatePath(AppRoutes.Audits(), "page");
  }
}
