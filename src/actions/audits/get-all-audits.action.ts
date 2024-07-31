"use server";

import { redirect } from "next/navigation";
import prisma from "@lib/db";
import { Role } from "@prisma/client";
import { checkAuthAndPermissions } from "@/permissions/check-permissions";
import { formatAuditData } from "@/lib/formatters/audit.formatter";
import { logError } from "@/lib/logging";

export async function getAllAudits(): Promise<Audit[]> {
  // check permissions
  const session = await checkAuthAndPermissions({
    accessLevelRequired: Role.ADMIN,
  });
  if (!session) {
    redirect("/login");
  }
  const tenantId = session.user.tenantId;

  // get companies
  try {
    const audits = await prisma.audit.findMany({
      where: {
        tenantId,
      },
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

    return audits.map((audit) =>
      formatAuditData({
        audit,
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
