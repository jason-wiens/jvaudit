"use server";

import prisma from "@lib/db";
import { ServerActionResponse } from "@/types/types";
import { checkAuthorized } from "@/permissions";
import { logError, logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";

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

    revalidatePath("/app/audits/[auditId]", "layout");

    return {
      success: true,
    };
  } catch (error) {
    const message = `Failed to delete message: ${messageId}`;
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
  }
}
