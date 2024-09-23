"use server";

import prisma from "@lib/db";
import type { ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { revalidatePath } from "next/cache";
import { logError, logAction } from "@/lib/logging";
import { AppRoutes } from "@/lib/routes.app";
import { handleServerError } from "@/lib/handle-server-errors";

type DeleteCompanyInputs = {
  companyId: string;
};

export async function deleteCompany({
  companyId,
}: DeleteCompanyInputs): Promise<ServerActionResponse<{}, void>> {
  // check permissions
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // update company
  try {
    const company = await prisma.company.findUnique({
      where: {
        companyId,
        tenantId,
      },
      select: {
        companyId: true,
        stakeholderIn: {
          select: {
            stakeholderId: true,
          },
        },
      },
    });

    if (!company) {
      return {
        success: false,
        message: "Company not found",
      };
    }

    // if company is a stakeholder in any audits, set company to inactive
    if (company.stakeholderIn.length > 0) {
      await prisma.company.update({
        where: {
          companyId,
          tenantId,
        },
        data: {
          active: false,
        },
      });
      logAction({
        timestamp: new Date(),
        user: session.user,
        type: "delete",
        message: `Company set to inActive: ${companyId}`,
      });
    }

    // if the company is not a stakeholder in any audits, delete company
    await prisma.company.delete({
      where: {
        companyId,
        tenantId,
      },
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "delete",
      message: `Company deleted: ${companyId}`,
    });

    return { success: true };
  } catch (error) {
    return handleServerError({
      error,
      message: "Failed to delete / deactivate company",
      user: session.user,
    });
  } finally {
    revalidatePath(AppRoutes.Companies(), "page");
  }
}
