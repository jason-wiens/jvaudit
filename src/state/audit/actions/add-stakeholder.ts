"use server";

import { ServerActionResponse } from "@/types/types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  AddStakeholderFormInputs,
  createStakeholderSchema,
} from "@/schemas/stakeholder.schema";
import { serializeZodError } from "@/lib/utils";
import { logAction } from "@/lib/logging";
import { checkAdmin } from "@/permissions";
import { handleServerError } from "@/lib/handle-server-errors";
import { AppRoutes } from "@/lib/routes.app";

export async function addStakeholder(
  inputs: AddStakeholderFormInputs
): Promise<ServerActionResponse<AddStakeholderFormInputs, void>> {
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
  const validatedInputs = createStakeholderSchema.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  const { auditId, companyId, type } = validatedInputs.data;

  try {
    // check if audit exists
    const audit = await prisma.audit.findUnique({
      where: { auditId, tenantId },
    });

    const company = await prisma.company.findUnique({
      where: { companyId, tenantId },
    });

    if (!audit || !company) {
      return {
        success: false,
        message: "Audit or company not found",
      };
    }

    await prisma.stakeholder.create({
      data: {
        auditId,
        companyId,
        type,
        tenantId,
      },
    });
    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "add",
      message: `Added stakeholder: ${companyId} to audit: ${auditId}`,
    });
    return {
      success: true,
    };
  } catch (error) {
    return handleServerError({
      error,
      user: session.user,
      message: "Error adding stakeholder",
    });
  } finally {
    revalidatePath(AppRoutes.Audit(), "page");
  }
}
