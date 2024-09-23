"use server";

import { ServerActionResponse } from "@/types/types";
import { auth } from "@/state";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { AddScopeFormInputs, createScopeSchema } from "@/schemas/scope.schema";
import { serializeZodError } from "@/lib/utils";
import { logAction, logError } from "@/lib/logging";
import { checkAdmin } from "@/permissions";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

export async function addScope(
  inputs: AddScopeFormInputs
): Promise<ServerActionResponse<AddScopeFormInputs>> {
  // check permissions
  const { session, message } = await checkAdmin();
  if (message) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // validate inputs
  const validatedInputs = createScopeSchema.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  const { type, auditId } = validatedInputs.data;

  try {
    // check if audit and employee exist
    const audit = await prisma.audit.findUnique({
      where: { auditId, tenantId },
      include: { stakeholders: true },
    });

    if (!audit) {
      return {
        success: false,
        message: "Audit not found",
      };
    }

    await prisma.scope.create({
      data: {
        auditId,
        tenantId,
        type,
      },
    });
    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "add",
      message: `Added Scope: ${type} to audit: ${auditId}`,
    });
    return { success: true };
  } catch (error) {
    return handleServerError({
      error,
      user: session.user,
      message: "Error adding scope",
    });
  } finally {
    revalidatePath(AppRoutes.Audit(), "page");
  }
}
