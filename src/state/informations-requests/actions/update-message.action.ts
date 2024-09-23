"use server";

import { Prisma } from "@prisma/client";
import prisma from "@lib/db";
import {
  updateIrMessageSchema,
  UpdateIrMessageFormInputs,
} from "@/schemas/ir-message.schema";
import type { ServerActionResponse } from "@/types/types";
import { checkAuthorized } from "@/permissions";
import { serializeZodError } from "@/lib/utils";
import { logError, logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";
import sanitize from "sanitize-html";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

export async function updateIrMessage(inputs: {
  messageId: string;
  messageData: UpdateIrMessageFormInputs;
}): Promise<ServerActionResponse<UpdateIrMessageFormInputs>> {
  // check permissions
  const session = await checkAuthorized();
  const tenantId = session.user.tenantId;
  const authorId = session.user.userId;

  // validate inputs
  const validatedInputs = updateIrMessageSchema.safeParse(inputs.messageData);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  const { messageId } = inputs;

  // body is a rich text html string and requires sanitization
  const { body } = validatedInputs.data;
  const sanitizedBody = sanitize(body);

  // update IR message
  try {
    const irMessage = await prisma.irMessage.findUnique({
      where: { messageId, tenantId },
      include: { author: true },
    });

    if (!irMessage) {
      return {
        success: false,
        message: "IR message not found",
      };
    }

    if (irMessage.authorId !== authorId) {
      return {
        success: false,
        message:
          "You are not authorized to perform this action. Only the author of the message can update it.",
      };
    }

    await prisma.irMessage.update({
      where: { messageId, tenantId },
      data: {
        body: sanitizedBody,
      },
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "update",
      message: `Updated message ${messageId}`,
    });
    return {
      success: true,
    };
  } catch (error) {
    return handleServerError({
      user: session.user,
      error,
      message: "Failed to update message",
    });
  } finally {
    revalidatePath(AppRoutes.InformationRequest(), "page");
  }
}
