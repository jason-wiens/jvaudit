"use server";

import prisma from "@lib/db";
import type { ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { revalidatePath } from "next/cache";
import { logError, logAction } from "@/lib/logging";

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
