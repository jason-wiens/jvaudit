"use server";

import { ServerActionResponse } from "@/types/types";
import { AuditStatus } from "@prisma/client";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { uuidRegex } from "@/lib/utils";
import { checkAdmin } from "@/permissions";

const deleteResourceParams = z.object({
  resourceId: z
    .string()
    .regex(uuidRegex, { message: "Invalid stakeholder ID" }),
});

type DeleteResourceParams = z.infer<typeof deleteResourceParams>;

export async function deleteResource(
  inputs: DeleteResourceParams
): Promise<ServerActionResponse<DeleteResourceParams>> {
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // validate inputs
  const validatedInputs = deleteResourceParams.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      message: "Invalid stakeholder ID",
    };
  }

  const { resourceId } = validatedInputs.data;

  try {
    // check if resource exists
    const resource = await prisma.resource.findUnique({
      where: { resourceId, tenantId },
      include: { audit: true },
    });

    if (!resource) {
      return {
        success: false,
        message: "Resource not found",
      };
    }

    // after an audit is confirmed, stakeholders can not be deleted
    // so we check if the audit is in CREATED status
    if (resource.audit.status === AuditStatus.CREATED) {
      await prisma.resource.delete({
        where: { resourceId, tenantId },
      });
      return { success: true };
    } else {
      return {
        success: false,
        message:
          "Can not delete resource from an audit that has been confirmed",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while deleting the resource",
    };
  } finally {
    revalidatePath("/admin/audits/[auditId]", "layout");
  }
}
