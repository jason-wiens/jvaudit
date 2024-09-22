"use server";

import prisma from "@lib/db";
import { Tenant } from "@prisma/client";

type GetAuditsInput = {
  tenantId: Tenant["tenantId"];
};

export async function getAudits({ tenantId }: GetAuditsInput) {
  return await prisma.audit.findMany({
    where: {
      tenantId,
    },
    select: {
      auditId: true,
      auditNumber: true,
      auditDescription: true,
      status: true,
      stakeholders: {
        select: {
          type: true,
          company: {
            select: {
              shortName: true,
            },
          },
        },
      },
    },
  });
}
