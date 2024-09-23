"use server";

import prisma from "@lib/db";
import type { ServerActionResponse } from "@/types/types";
import { checkAuthorized } from "@/permissions";

import { logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

export async function deleteInformationRequest(
  irId: string
): Promise<ServerActionResponse> {
  // check permissions
  const session = await checkAuthorized();
  const tenantId = session.user.tenantId;

  try {
    const ir = await prisma.informationRequest.findUnique({
      where: { irId, tenantId },
      include: { audit: true },
    });

    if (!ir) {
      return {
        success: false,
        message: "Information Request not found",
      };
    }

    // irs can only be deleted if they are not submitted
    if (ir.submitted) {
      return {
        success: false,
        message:
          "Information Requests that have been submitted cannot be deleted",
      };
    }

    await prisma.informationRequest.delete({
      where: { irId, tenantId },
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "delete",
      message: `Deleted IR ${ir.number} for audit ${ir.audit.auditNumber}`,
    });
    return { success: true };
  } catch (error) {
    return handleServerError({
      error,
      message: "Failed to delete information request",
      user: session.user,
    });
  } finally {
    revalidatePath(AppRoutes.InformationRequest(), "page");
  }
}
