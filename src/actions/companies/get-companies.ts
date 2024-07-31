"use server";

import { redirect } from "next/navigation";
import prisma from "@lib/db";
import { Role } from "@prisma/client";
import { checkAuthAndPermissions } from "@/permissions/check-permissions";
import { formatCompanyData } from "@/lib/formatters/company.formatter";
import { logError } from "@/lib/logging";

type GetCompanyInputs = {
  activeOnly?: boolean;
};

export async function getCompanies({
  activeOnly = true,
}: GetCompanyInputs): Promise<Company[]> {
  // check permissions
  const session = await checkAuthAndPermissions({
    accessLevelRequired: Role.USER,
  });
  if (!session) {
    redirect("/login");
  }
  const tenantId = session.user.tenantId;

  // get companies
  try {
    const companies = await prisma.company.findMany({
      where: {
        active: activeOnly,
        tenantId,
      },
      include: {
        employees: {
          include: {
            personalProfile: true,
          },
        },
      },
    });

    return companies.map((company) =>
      formatCompanyData({
        company,
      })
    );
  } catch (error) {
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message: "Error getting companies",
    });
    return [];
  }
}
