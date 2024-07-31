"use server";

import prisma from "@lib/db";
import {
  createStakeholderSchema,
  AddStakeholderFormInputs,
} from "@/schemas/stakeholder.schema";
import type { ServerActionResponse } from "@/types/types";
import { checkAuthAndPermissions } from "@/permissions/check-permissions";
import { Role } from "@prisma/client";
import { serializeZodError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { logAction, logError } from "@/lib/logging";

export async function addStakeholder(
  inputs: AddStakeholderFormInputs
): Promise<ServerActionResponse<AddStakeholderFormInputs>> {
  // check permissions
  const session = await checkAuthAndPermissions({
    accessLevelRequired: Role.ADMIN,
  });
  if (!session) {
    return {
      success: false,
      message: "You are not authorized to perform this action",
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
      where: { auditId },
    });

    const company = await prisma.company.findUnique({
      where: { companyId },
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
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message: `Error adding stakeholder: ${companyId} to audit: ${auditId}`,
    });
    return {
      success: false,
      message: `Error adding stakeholder: ${companyId} to audit: ${auditId}`,
    };
  }
}
