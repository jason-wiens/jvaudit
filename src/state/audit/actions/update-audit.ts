"use server";

import prisma from "@lib/db";
import {
  updateAuditSchema,
  UpdateAuditFormInputs,
} from "@/schemas/audits.schema";
import type { ServerActionResponse } from "@/types/types";
import { Audit, Prisma } from "@prisma/client";
import { serializeZodError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { logAction, logError } from "@/lib/logging";
import { isValidUUID } from "@/lib/utils";
import { checkAdmin } from "@/permissions";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const uniqueConstraint = (error.meta?.target as string[]) || [];
        if (uniqueConstraint.includes("auditNumber")) {
          return {
            success: false,
            formErrors: [
              {
                field: "auditNumber",
                message: "Audit number already exists",
              },
            ],
          };
        }
      }
    }

    return handleServerError({
      error,
      message: "Unable to update audit",
      user: session.user,
    });
  } finally {
    revalidatePath(AppRoutes.Audit(), "page");
  }
}
