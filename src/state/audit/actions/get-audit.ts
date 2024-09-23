"use server";

import { logError } from "@/lib/logging";
import { ServerActionResponse } from "@/types/types";
import prisma from "@lib/db";
import { Tenant, Audit as PrismaAudit } from "@prisma/client";
import { checkAdmin, checkAuthorized } from "@/permissions";
import { handleServerError } from "@/lib/handle-server-errors";
import { Session } from "next-auth/types";

type GetAuditsInput = {
  auditId: PrismaAudit["auditId"];
  user: Session["user"];
};

const auditInclude = {
  stakeholders: {
    include: {
      company: {
        include: {
          employees: {
            include: {
              personalProfile: true,
            },
          },
        },
      },
    },
  },
  resources: {
    include: {
      employee: {
        include: {
          personalProfile: true,
        },
      },
    },
  },
  scopes: {
    include: {
      resources: {
        include: {
          employee: {
            include: {
              personalProfile: true,
            },
          },
        },
      },
    },
  },
};

// this function should not be imported or used directly, it should be called from getAudit.ts
async function getAuditDbQueryAsAdmin({ auditId, user }: GetAuditsInput) {
  return await prisma.audit.findUnique({
    where: {
      tenantId: user.tenantId,
      auditId,
    },
    include: auditInclude,
  });
}

type Audit = NonNullable<Awaited<ReturnType<typeof getAuditDbQueryAsAdmin>>>;

export async function getAudit({
  auditId,
  user,
}: GetAuditsInput): Promise<Audit | null> {
  if (user.isAdmin) {
    return await prisma.audit.findUnique({
      where: {
        tenantId: user.tenantId,
        auditId,
      },
      include: auditInclude,
    });
  }

  const resAudit = await prisma.resource.findFirst({
    where: {
      auditId,
      tenantId: user.tenantId,
      employeeId: user.employeeId,
    },
    include: {
      audit: {
        include: auditInclude,
      },
    },
  });

  return resAudit?.audit || null;
}
