"use server";

import prisma from "@lib/db";
import type { ServerActionResponse } from "@/types/types";
import { checkAuthAndPermissions } from "@/permissions/check-permissions";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { logError, logAction } from "@/lib/logging";

type DeleteCompanyInputs = {
  companyId: string;
};

export async function deleteCompany({
  companyId,
}: DeleteCompanyInputs): Promise<ServerActionResponse<{}, void>> {
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

  // update company
  try {
    await prisma.company.update({
      where: { companyId, tenantId },
      data: {
        active: false,
        activeDate: new Date(),
      },
    });
    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "delete",
      message: `Company deleted: ${companyId}`,
    });
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message: `Error deleting company: ${companyId}`,
    });
    return {
      success: false,
      message: "An error occurred while deleteing the company",
    };
  }
}
