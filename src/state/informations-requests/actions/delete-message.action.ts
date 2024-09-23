"use server";

import prisma from "@lib/db";
import { ServerActionResponse } from "@/types/types";
import { checkAuthorized } from "@/permissions";
import { logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

export async function deleteIrMessage(
  messageId: string
): Promise<ServerActionResponse> {
  // check permissions
  const session = await checkAuthorized();
  const tenantId = session.user.tenantId;
  const authorId = session.user.userId;

  // delete IR message
  try {
    const irMessage = await prisma.irMessage.findUnique({
      where: { messageId, tenantId },
      include: { author: true, ir: { select: { resolved: true } } },
    });

    if (!irMessage) {
      return {
        success: false,
        message: "IR message not found",
      };
    }

    // only author can delete their own messages
    if (irMessage.authorId !== authorId) {
      return {
        success: false,
        message:
          "You are not authorized to delete this IR message. Only the author can delete their own messages",
      };
    }

    // only unresolved IR messages can be deleted
    if (irMessage.ir.resolved) {
      return {
        success: false,
        message: "You cannot delete a message from a resolved IR",
      };
    }

    await prisma.irMessage.delete({
      where: { messageId, tenantId },
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "delete",
      message: `Successfully deleted message: ${messageId}`,
    });

    return {
      success: true,
    };
  } catch (error) {
    return handleServerError({
      error,
      message: "Failed to delete message",
      user: session.user,
    });
  } finally {
    revalidatePath(AppRoutes.InformationRequest(), "page");
  }
}
