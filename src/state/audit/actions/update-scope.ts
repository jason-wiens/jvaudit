"use server";

import { ServerActionResponse } from "@/types/types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  UpdateScopeFormInputs,
  updateScopeSchema,
} from "@/schemas/scope.schema";
import { isValidUUID, serializeZodError } from "@/lib/utils";
import { logAction, logError } from "@/lib/logging";
import { checkAdmin } from "@/permissions";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

type UpdateScopeInput = {
  scopeId: string;
  scopeData: UpdateScopeFormInputs;
};

export async function updateScope({
  scopeId,
  scopeData,
}: UpdateScopeInput): Promise<ServerActionResponse<UpdateScopeFormInputs>> {
  // check permissions
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // validate resourceId
  if (!isValidUUID(scopeId)) {
    return {
      success: false,
      message: "Invalid resourceId",
    };
  }

  // validate inputs
  const validatedInputs = updateScopeSchema.safeParse(scopeData);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  try {
    await prisma.scope.update({
      where: {
        scopeId,
        tenantId,
      },
      data: {
        ...validatedInputs.data,
      },
    });
    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "update",
      message: `Updated Scope: ${scopeId}`,
    });
    return { success: true };
  } catch (error) {
    return handleServerError({
      error,
      user: session.user,
      message: "Error updating scope",
    });
  } finally {
    revalidatePath(AppRoutes.Audit(), "page");
  }
}
