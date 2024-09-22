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
import { logError, logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";

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
    revalidatePath("/app/audits/[auditId]", "layout");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const uniqueConstraint = (error.meta?.target as string[]) || [];
        logError({
          timestamp: new Date(),
          user: session.user,
          error,
          message: `Error adding Audit, violated unique constraints: ${uniqueConstraint.join(
            ", "
          )}`,
        });
        return {
          success: false,
          message: `The IR number is already in use. Please try again.`,
        };
      }
    }
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message: `Unable to create IR for audit ${auditId}`,
    });
    return {
      success: false,
      message: "An error occurred while adding the Information Request",
    };
  }
}
