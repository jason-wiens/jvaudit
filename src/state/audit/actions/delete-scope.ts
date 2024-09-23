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

const deleteScopeParams = z.object({
  scopeId: z.string().regex(uuidRegex, { message: "Invalid stakeholder ID" }),
});

type DeleteScopeParams = z.infer<typeof deleteScopeParams>;

export async function deleteScope(
  inputs: DeleteScopeParams
): Promise<ServerActionResponse<DeleteScopeParams>> {
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // validate inputs
  const validatedInputs = deleteScopeParams.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      message: "Invalid stakeholder ID",
    };
  }

  const { scopeId } = validatedInputs.data;

  try {
    // check if resource exists
    const scope = await prisma.scope.findUnique({
      where: { scopeId, tenantId },
      include: { audit: true },
    });

    if (!scope) {
      return {
        success: false,
        message: "Scope not found",
      };
    }

    // after an audit is confirmed, stakeholders can not be deleted
    // so we check if the audit is in CREATED status
    if (scope.audit.status === AuditStatus.CREATED) {
      await prisma.scope.delete({
        where: { scopeId, tenantId },
      });
      return { success: true };
    } else {
      return {
        success: false,
        message: "Can not delete a scope from an audit that has been confirmed",
      };
    }
  } catch (error) {
    return handleServerError({
      error,
      user: session.user,
      message: "Error deleting scope",
    });
  } finally {
    revalidatePath(AppRoutes.Audit(), "page");
  }
}
