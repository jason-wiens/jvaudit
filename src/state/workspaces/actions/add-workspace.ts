import {
  createWorkspaceSchema,
  AddWorkspaceFormInputs,
} from "@/schemas/workspace.schema";
import { checkAdmin } from "@/permissions";
import { serializeZodError } from "@/lib/utils";
import { logError, logAction } from "@/lib/logging";
import prisma from "@lib/db";
import { revalidatePath } from "next/cache";
import { AppRoutes } from "@/lib/routes.app";
import { ServerActionResponse } from "@/types/types";
import { handleServerError } from "@/lib/handle-server-errors";

export const addWorkspace = async (
  inputs: AddWorkspaceFormInputs
): Promise<ServerActionResponse<AddWorkspaceFormInputs>> => {
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // validate inputs
  const validatedInputs = createWorkspaceSchema.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  const { name, type } = validatedInputs.data;

  try {
    // add workspace
    await prisma.workspace.create({
      data: {
        name,
        type,
        tenantId,
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
    return handleServerError({
      user: session.user,
      error,
      message: "Failed to add workspace",
    });
  } finally {
    revalidatePath(AppRoutes.Workspaces(), "page");
  }
};
