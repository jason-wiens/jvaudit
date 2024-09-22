"use server";

import prisma from "@lib/db";
import { Company, Tenant } from "@prisma/client";

export const getCompany = async (inputs: {
  companyId: Company["companyId"];
  tenantId: Tenant["tenantId"];
}) => {
  const { companyId, tenantId } = inputs;

  return await prisma.company.findUnique({
    where: {
      companyId,
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
};
