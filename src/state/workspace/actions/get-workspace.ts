"use server";

import { handleServerError } from "@/lib/handle-server-errors";
import { logError } from "@/lib/logging";
import { checkAdmin } from "@/permissions";
import { ServerActionResponse } from "@/types/types";
import prisma from "@lib/db";

type GetWorkspaceDbQueryInput = {
  workspaceId: string;
  tenantId: string;
};

export const getWorkspaceDbQuery = async ({
  workspaceId,
  tenantId,
}: GetWorkspaceDbQueryInput) =>
  await prisma.workspace.findUnique({
    where: {
      workspaceId,
      tenantId,
    },
    include: {
      statistics: true,
    },
  });

type GetWorkspaceInput = {
  workspaceId: string;
};

export const getWorkspace = async ({
  workspaceId,
}: GetWorkspaceInput): Promise<
  ServerActionResponse<
    {},
    { workspace: Awaited<ReturnType<typeof getWorkspaceDbQuery>> }
  >
> => {
  const { session, message } = await checkAdmin();
  if (!session)
    return {
      success: false,
      message,
    };
  const tenantId = session.user.tenantId;

  try {
    const workspace = await getWorkspaceDbQuery({ tenantId, workspaceId });
    return {
      success: true,
      data: { workspace },
    };
  } catch (error) {
    return handleServerError({
      error,
      message: "Failed to get workspace",
      user: session.user,
    });
  }
};
