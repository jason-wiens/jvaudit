"use server";

import { ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

import {
  AddResourceFormInputs,
  createResourceSchema,
} from "@/schemas/resource.schema";
import { serializeZodError } from "@/lib/utils";
import { logAction, logError } from "@/lib/logging";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

export async function addResource(
  inputs: AddResourceFormInputs
): Promise<ServerActionResponse<AddResourceFormInputs>> {
  // check permissions
  const { session, message } = await checkAdmin();
  if (message) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // validate inputs
  const validatedInputs = createResourceSchema.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  const { type, auditId, employeeId } = validatedInputs.data;

  try {
    // check if audit and employee exist
    const audit = await prisma.audit.findUnique({
      where: { auditId, tenantId },
      include: { stakeholders: true },
    });

    const employee = await prisma.employee.findUnique({
      where: { employeeId, tenantId },
    });

    if (!audit || !employee) {
      return {
        success: false,
        message: "Either one of the Audit or the Employee were not found",
      };
    }

    // makesure the employee's company is a stakeholder in the audit
    const isValid = audit.stakeholders.some(
      (s) => s.companyId === employee.companyId
    );

    if (!isValid) {
      return {
        success: false,
        message: "Employee's company is not a stakeholder in the audit",
      };
    }

    await prisma.resource.create({
      data: {
        auditId,
        employeeId,
        tenantId,
        type,
      },
    });
    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "add",
      message: `Added Resource: ${employeeId} to audit: ${auditId}`,
    });
    return { success: true };
  } catch (error) {
    return handleServerError({
      error,
      user: session.user,
      message: "Error adding resource",
    });
  } finally {
    revalidatePath(AppRoutes.Audit(), "page");
  }
}
