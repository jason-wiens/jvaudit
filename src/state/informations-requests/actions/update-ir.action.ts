"use server";

import { Prisma } from "@prisma/client";
import prisma from "@lib/db";
import {
  updateInformationRequestSchema,
  UpdateInformationRequestFormInputs,
  UpdateInformationRequestInputs,
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

  const cleanedInputs: UpdateInformationRequestInputs = cleanUndefinedFields(
    validatedInputs.data
  );
  const { body, actionRequested, submittedToId, resolved } = cleanedInputs;

  // body and actionRequest are Rich Text html fields and require extra sanitization
  if (!!body) {
    cleanedInputs.body = sanitizeHtml(body);
  }
  if (!!actionRequested) {
    cleanedInputs.actionRequested = sanitizeHtml(actionRequested);
  }

  // if resolved is true, set resolvedDate to now
  if (resolved) cleanedInputs.resolvedDate = new Date();

  try {
    const ir = await prisma.informationRequest.findUnique({
      where: { irId, tenantId },
      include: { audit: { include: { irs: true } } },
    });

    if (!ir) {
      return {
        success: false,
        message: "Information Request not found",
      };
    }

    const existingIRNumbers = ir.audit.irs.map((ir) => ir.number);
    const number = getNextAvailableInteger(existingIRNumbers);

    // if the field submittedToId is provided we need to check if the employee exists
    // and then set the submitted and submittedDate fields
    if (submittedToId) {
      const employee = await prisma.employee.findUnique({
        where: { employeeId: submittedToId, tenantId },
      });
      if (!employee) {
        return {
          success: false,
          formErrors: [
            { field: "submittedToId", message: "Employee not found" },
          ],
        };
      }
      cleanedInputs.submitted = true;
      cleanedInputs.submittedDate = new Date();
    }

    await prisma.informationRequest.update({
      where: { irId, tenantId },
      data: cleanedInputs,
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "update",
      message: `Updated IR ${number} for udit ${ir.audit.auditNumber}`,
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
          message: `Error updating Audit, violated unique constraints: ${uniqueConstraint.join(
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
      message: `Unable to update IR ${irId}`,
    });
    return {
      success: false,
      message: "An error occurred while updating the Information Request",
    };
  }
}
