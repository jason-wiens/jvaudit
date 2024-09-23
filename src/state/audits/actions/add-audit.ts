"use server";

import { Prisma } from "@prisma/client";
import prisma from "@lib/db";
import { createAuditSchema, AddAuditFormInputs } from "@/schemas/audits.schema";
import type { FormError, ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { serializeZodError } from "@/lib/utils";
import { logError, logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";
import { isValidUUID } from "@/lib/utils";
import { AppRoutes } from "@/lib/routes.app";
import { handleServerError } from "@/lib/handle-server-errors";

export async function addAudit(inputs: {
  auditData: AddAuditFormInputs;
  workspaceId: string;
}): Promise<ServerActionResponse<AddAuditFormInputs>> {
  const { auditData, workspaceId } = inputs;

  // check permissions
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // validate inputs
  const validatedInputs = createAuditSchema.safeParse(auditData);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }
  const { auditNumber, auditDescription } = validatedInputs.data;
  if (!isValidUUID(inputs.workspaceId)) {
    return {
      success: false,
      message: "Invalid workspace ID",
    };
  }

  // add company
  try {
    await prisma.audit.create({
      data: {
        auditNumber,
        auditDescription,
        tenantId,
        workspaceId,
      },
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "add",
      message: `Audit added: ${validatedInputs.data.auditNumber}`,
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
                message: "This audit number already exists",
              },
            ],
          };
        }
      }
    }

    return handleServerError({
      error,
      message: "Failed to add audit",
      user: session.user,
    });
  } finally {
    revalidatePath(AppRoutes.Audits(), "page");
  }
}
