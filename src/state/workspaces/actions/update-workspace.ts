import {
  updateWorkspaceSchema,
  UpdateWorkspaceFormInputs,
} from "@/schemas/workspace.schema";
import { checkAdmin } from "@/permissions";
import { serializeZodError } from "@/lib/utils";
import { logError, logAction } from "@/lib/logging";
import prisma from "@lib/db";
import { revalidatePath } from "next/cache";
import { AppRoutes } from "@/lib/routes.app";
import { ServerActionResponse } from "@/types/types";
import { Prisma, Workspace } from "@prisma/client";
import { isValidUUID } from "@/lib/utils";

export const updateWorkspace = async (inputs: {
  workspaceId: Workspace["workspaceId"];
  workspaceData: UpdateWorkspaceFormInputs;
}): Promise<ServerActionResponse<UpdateWorkspaceFormInputs>> => {
  const { workspaceId, workspaceData } = inputs;

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
  const validatedInputs = updateWorkspaceSchema.safeParse(workspaceData);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }
  if (!isValidUUID(workspaceId)) {
    return {
      success: false,
      message: "Invalid workspace ID",
    };
  }

  // update workspace
  try {
    await prisma.workspace.update({
      where: {
        workspaceId,
        tenantId,
      },
      data: {
        ...validatedInputs.data,
      },
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "add",
      message: `Created workspace: ${name}`,
    });

    return {
      success: true,
    };
  } catch (error) {
    let message =
      error instanceof Error
        ? error.message
        : `Error Updating Workspace: ${workspaceId}`;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        message = `Error updating workspace: ${workspaceId}, workspace does not exist.`;
      }
    }
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message,
    });
    return {
      success: false,
      message,
    };
  } finally {
    revalidatePath(AppRoutes.Workspaces(), "page");
  }
};
