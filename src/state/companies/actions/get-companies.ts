"use server";

import prisma from "@lib/db";
import { Tenant } from "@prisma/client";

export const getCompanies = async (inputs: {
  tenantId: Tenant["tenantId"];
}) => {
  const { tenantId } = inputs;

  return await prisma.company.findMany({
    where: {
      active: true,
      tenantId,
    },
    include: {
      employees: {
        where: {
          active: true,
        },
        include: {
          personalProfile: true,
        },
      },
    },
  });
};
