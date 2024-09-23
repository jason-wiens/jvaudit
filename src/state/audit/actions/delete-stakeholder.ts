"use server";

import { ServerActionResponse } from "@/types/types";
import { AuditStatus } from "@prisma/client";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { uuidRegex } from "@/lib/utils";
import { checkAdmin } from "@/permissions";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

const deleteStakeholderParams = z.object({
  stakeholderId: z
    .string()
    .regex(uuidRegex, { message: "Invalid stakeholder ID" }),
});

type DeleteStakeholderParams = z.infer<typeof deleteStakeholderParams>;

export async function deleteStakeholder(
  inputs: DeleteStakeholderParams
): Promise<ServerActionResponse<DeleteStakeholderParams>> {
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // validate inputs
  const validatedInputs = deleteStakeholderParams.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      message: "Invalid stakeholder ID",
    };
  }

  const { stakeholderId } = validatedInputs.data;

  try {
    // check if stakeholder exists
    const stakeholder = await prisma.stakeholder.findFirst({
      where: { stakeholderId, tenantId },
      include: { audit: true },
    });

    if (!stakeholder) {
      return {
        success: false,
        message: "Stakeholder not found",
      };
    }

    // after an audit is confirmed, stakeholders can not be deleted
    // so we check if the audit is in CREATED status
    if (stakeholder.audit.status === AuditStatus.CREATED) {
      await prisma.stakeholder.delete({
        where: { stakeholderId, tenantId },
      });
      return { success: true };
    } else {
      return {
        success: false,
        message:
          "Can not delete stakeholder from an audit that has been confirmed",
      };
    }
  } catch (error) {
    return handleServerError({
      error,
      user: session.user,
      message: "Error deleting stakeholder",
    });
  } finally {
    revalidatePath(AppRoutes.Audit(), "page");
  }
}
