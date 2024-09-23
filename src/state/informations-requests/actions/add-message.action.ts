"use server";

import prisma from "@lib/db";
import {
  createIrMessageSchema,
  AddIrMessageFormInputs,
} from "@/schemas/ir-message.schema";
import type { ServerActionResponse } from "@/types/types";
import { checkAuthorized } from "@/permissions";
import { serializeZodError } from "@/lib/utils";
import { logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";
import sanitize from "sanitize-html";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

export async function addIrMessage(
  inputs: AddIrMessageFormInputs
): Promise<ServerActionResponse<AddIrMessageFormInputs>> {
  // check permissions
  const session = await checkAuthorized();
  const tenantId = session.user.tenantId;
  const authorId = session.user.userId;

  // validate inputs
  const validatedInputs = createIrMessageSchema.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  const { irId, body } = validatedInputs.data;

  // body is a rich text html string and requires sanitization
  const sanitizedBody = sanitize(body);

  let irNumber: number | undefined = undefined;
  // add IR message
  try {
    const ir = await prisma.informationRequest.findUnique({
      where: { irId, tenantId },
      include: { correspondence: true },
    });

    if (!ir) {
      return {
        success: false,
        message: "IR not found",
      };
    }
    irNumber = ir.number;

    await prisma.irMessage.create({
      data: {
        authorId,
        tenantId,
        irId,
        body: sanitizedBody,
      },
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "add",
      message: `Added message to IR ${irNumber}`,
    });

    return { success: true };
  } catch (error) {
    return handleServerError({
      error,
      message: "Failed to delete / deactivate company",
      user: session.user,
    });
  } finally {
    revalidatePath(AppRoutes.InformationRequest(), "page");
  }
}
