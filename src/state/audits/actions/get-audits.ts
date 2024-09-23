"use server";

import prisma from "@lib/db";
import { Tenant } from "@prisma/client";
import { Session } from "next-auth/types";

type GetAuditsInput = {
  tenantId: Tenant["tenantId"];
  workspaceId: string;
  user: Session["user"];
  active?: boolean;
};

const auditSelect = {
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
};

// this function should not be imported or used directly, it should be called from getAudits.ts
async function getAuditsDbQueryAsAdmin({
  tenantId,
  workspaceId,
  active = true,
}: GetAuditsInput) {
  return await prisma.audit.findMany({
    where: {
      tenantId,
      workspaceId,
      active,
    },
    select: auditSelect,
  });
}

type Audit = NonNullable<
  Awaited<ReturnType<typeof getAuditsDbQueryAsAdmin>>[0]
>;

export async function getAuditDbQuery({
  tenantId,
  workspaceId,
  active = true,
  user,
}: GetAuditsInput): Promise<Audit[]> {
  if (user.isAdmin) {
    return await getAuditsDbQueryAsAdmin({
      tenantId,
      workspaceId,
      active,
      user,
    });
  }

  const resAudits = await prisma.resource.findMany({
    where: {
      tenantId,
      employeeId: user.employeeId,
      active,
    },
    select: {
      audit: {
        select: auditSelect,
      },
    },
  });

  return resAudits?.map((resAudit) => resAudit.audit) || [];
}
