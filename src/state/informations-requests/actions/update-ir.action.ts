"use server";

import { Prisma } from "@prisma/client";
import prisma from "@lib/db";
import {
  updateInformationRequestSchema,
  UpdateInformationRequestFormInputs,
} from "@/schemas/information-request.schema";
import type { ServerActionResponse } from "@/types/types";
import {
  serializeZodError,
  getNextAvailableInteger,
  cleanUndefinedFields,
} from "@/lib/utils";
import { logError, logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { checkAuthorized } from "@/permissions";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

export async function updateInformationRequest(inputs: {
  irId: string;
  irData: UpdateInformationRequestFormInputs;
}): Promise<ServerActionResponse<UpdateInformationRequestFormInputs>> {
  // check permissions
  const session = await checkAuthorized();
  const tenantId = session.user.tenantId;

  const { irId, irData } = inputs;

  // validate inputs
  const validatedInputs = updateInformationRequestSchema.safeParse(irData);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  // TODO: Add logic here
  try {
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const uniqueConstraint = (error.meta?.target as string[]) || [];

        return {
          success: false,
          message: `The IR number is already in use. Please try again.`,
        };
      }
    }

    return handleServerError({
      user: session.user,
      error,
      message: "Failed to update information request",
    });
  } finally {
    revalidatePath(AppRoutes.InformationRequest(), "page");
  }
}
