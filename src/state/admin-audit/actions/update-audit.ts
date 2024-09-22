"use server";

import prisma from "@lib/db";
import {
  updateAuditSchema,
  UpdateAuditFormInputs,
} from "@/schemas/audits.schema";
import type { ServerActionResponse } from "@/types/types";
import { Audit } from "@prisma/client";
import { serializeZodError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { logAction, logError } from "@/lib/logging";
import { isValidUUID } from "@/lib/utils";
import { checkAdmin } from "@/permissions";

type UpdateAuditInput = {
  auditId: Audit["auditId"];
  auditData: UpdateAuditFormInputs;
};

export async function updateAudit({
  auditId,
  auditData,
}: UpdateAuditInput): Promise<ServerActionResponse<UpdateAuditFormInputs>> {
  // check permissions
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // validate auditId
  if (!isValidUUID(auditId)) {
    return {
      success: false,
      message: "Invalid auditId",
    };
  }

  // validate inputs
  const validatedInputs = updateAuditSchema.safeParse(auditData);
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
  } finally {
    revalidatePath("/admin/audits/[auditId]", "layout");
  }
}
