"use server";

import prisma from "@lib/db";
import {
  updateAuditSchema,
  UpdateAuditFormInputs,
} from "@/schemas/audits.schema";
import type { ServerActionResponse } from "@/types/types";
import { checkAuthAndPermissions } from "@/permissions/check-permissions";
import { Role } from "@prisma/client";
import { serializeZodError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { logAction, logError } from "@/lib/logging";

type UpdateAuditInputs = {
  auditId: Audit["id"];
  auditData: UpdateAuditFormInputs;
};

export async function updateAudit({
  auditId,
  auditData: inputs,
}: UpdateAuditInputs): Promise<ServerActionResponse<UpdateAuditFormInputs>> {
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

  // validate inputs
  const validatedInputs = updateAuditSchema.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  // update company
  try {
    await prisma.audit.update({
      where: { auditId, tenantId },
      data: {
        ...validatedInputs.data,
      },
    });
    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "update",
      message: `Audit updated: ${validatedInputs.data.auditNumber}`,
    });
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message: `Error updating audit: ${validatedInputs.data.auditNumber}`,
    });
    return {
      success: false,
      message: "An error occurred while adding the audit",
    };
  }
}
