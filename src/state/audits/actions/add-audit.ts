"use server";

import { Audit, Prisma } from "@prisma/client";
import prisma from "@lib/db";
import { createAuditSchema, AddAuditFormInputs } from "@/schemas/audits.schema";
import type { FormError, ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { serializeZodError } from "@/lib/utils";
import { logError, logAction } from "@/lib/logging";
import { revalidatePath } from "next/cache";

export async function addAudit(
  inputs: AddAuditFormInputs
): Promise<ServerActionResponse<AddAuditFormInputs>> {
  // check permissions
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // validate inputs
  const validatedInputs = createAuditSchema.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  const { auditNumber, auditDescription } = validatedInputs.data;

  // add company
  try {
    const audit = await prisma.audit.create({
      data: {
        auditNumber,
        auditDescription,
        tenantId,
      },
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "add",
      message: `Audit added: ${validatedInputs.data.auditNumber}`,
    });
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const uniqueConstraint = (error.meta?.target as string[]) || [];
        const formErrors: FormError<AddAuditFormInputs>[] = [];
        if (uniqueConstraint.includes("auditNumber")) {
          formErrors.push({
            field: "auditNumber",
            message: "This audit number already exists",
          });
        }
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
          formErrors,
        };
      }
    }
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message: `Unable to create audit: ${validatedInputs.data.auditNumber}`,
    });
    return {
      success: false,
      message: "An error occurred while adding the audit",
    };
  }
}
