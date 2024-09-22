"use server";

import { ServerActionResponse } from "@/types/types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  UpdateResourceFormInputs,
  updateResourceSchema,
} from "@/schemas/resource.schema";
import { isValidUUID, serializeZodError } from "@/lib/utils";
import { logAction, logError } from "@/lib/logging";
import { checkAdmin } from "@/permissions";

type UpdateResourceInput = {
  resourceId: string;
  resourceData: UpdateResourceFormInputs;
};

export async function updateResource({
  resourceId,
  resourceData,
}: UpdateResourceInput): Promise<
  ServerActionResponse<UpdateResourceFormInputs>
> {
  // check permissions
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // validate resourceId
  if (!isValidUUID(resourceId)) {
    return {
      success: false,
      message: "Invalid resourceId",
    };
  }

  // validate inputs
  const validatedInputs = updateResourceSchema.safeParse(resourceData);
  if (!validatedInputs.success) {
    logError({
      timestamp: new Date(),
      user: session.user,
      error: validatedInputs.error,
      message: `Error validating inputs: ${JSON.stringify(
        resourceData,
        null,
        2
      )}`,
    });
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  try {
    await prisma.resource.update({
      where: {
        resourceId,
        tenantId,
      },
      data: {
        ...validatedInputs.data,
      },
    });
    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "update",
      message: `Updated Resource: ${resourceId}`,
    });
    return { success: true };
  } catch (error) {
    const message = `Error updating resource: ${resourceId}`;
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message,
    });
    return {
      success: false,
      message,
    };
  } finally {
    revalidatePath("/admin/audits/[auditId]", "layout");
  }
}
