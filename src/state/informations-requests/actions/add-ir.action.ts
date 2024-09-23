"use server";

import { Prisma } from "@prisma/client";
import prisma from "@lib/db";
import {
  createInformationRequestSchema,
  AddInformationRequestFormInputs,
} from "@/schemas/information-request.schema";
import type { ServerActionResponse } from "@/types/types";
import { checkAuthorized } from "@/permissions";
import { serializeZodError, getNextAvailableInteger } from "@/lib/utils";
import { logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

export async function addInformationRequest(
  inputs: AddInformationRequestFormInputs
): Promise<ServerActionResponse<AddInformationRequestFormInputs>> {
  // check permissions
  const session = await checkAuthorized();
  const tenantId = session.user.tenantId;
  const authorId = session.user.employeeId;

  // validate inputs
  const validatedInputs = createInformationRequestSchema.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  const { auditId, ...irData } = validatedInputs.data;

  // add IR
  try {
    const audit = await prisma.audit.findUnique({
      where: { auditId },
      include: { irs: true },
    });

    if (!audit) {
      return {
        success: false,
        message: "Audit not found",
      };
    }

    const existingIRNumbers = audit.irs.map((ir) => ir.number);
    const number = getNextAvailableInteger(existingIRNumbers);

    console.log({ existingIRNumbers, number });
    await prisma.informationRequest.create({
      data: {
        ...irData,
        auditId,
        tenantId,
        number,
        authorId,
      },
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "add",
      message: `IR ${number} added to audit ${audit.auditNumber}`,
    });
    return { success: true };
  } catch (error) {
    return handleServerError({
      error,
      message: "Failed to add Information Request",
      user: session.user,
    });
  } finally {
    revalidatePath(AppRoutes.Audit(), "page");
  }
}
