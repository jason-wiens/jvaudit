"use server";

import { logError } from "@/lib/logging";
import { ServerActionResponse } from "@/types/types";
import prisma from "@lib/db";
import { Audit, Tenant } from "@prisma/client";
import { checkAdmin } from "@/permissions";

type GetAuditsInput = {
  tenantId: Tenant["tenantId"];
  auditId: Audit["auditId"];
};

export async function getAdminAuditDbQuery({
  tenantId,
  auditId,
}: GetAuditsInput) {
  return await prisma.audit.findUnique({
    where: {
      tenantId,
      auditId,
    },
    include: {
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
    },
  });
}

type GetAdminAuditInput = {
  auditId: Audit["auditId"];
};

export const getAdminAudit = async ({
  auditId,
}: GetAdminAuditInput): Promise<
  ServerActionResponse<
    {},
    { audit: Awaited<ReturnType<typeof getAdminAuditDbQuery>> }
  >
> => {
  const { session, message } = await checkAdmin();
  if (!session)
    return {
      success: false,
      message,
    };

  const tenantId = session.user.tenantId;

  try {
    const audit = await getAdminAuditDbQuery({ tenantId, auditId });
    return {
      success: true,
      data: { audit },
    };
  } catch (error) {
    const message = "Database Error: Unable to to get audit.";
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
  }
};
