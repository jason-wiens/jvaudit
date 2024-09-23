"use server";

import { handleServerError } from "@/lib/handle-server-errors";
import { logError } from "@/lib/logging";
import { checkAdmin } from "@/permissions";
import { ServerActionResponse } from "@/types/types";
import prisma from "@lib/db";

type GetTenantDbQueryInput = {
  tenantId: string;
};

export const getTenantDbQuery = async ({ tenantId }: GetTenantDbQueryInput) =>
  await prisma.tenant.findUnique({
    where: {
      tenantId,
    },
    select: {
      tenantId: true,
      fullLegalName: true,
      shortName: true,
      address: true,
      createdAt: true,
    },
  });

export const getTenant = async (): Promise<
  ServerActionResponse<
    {},
    { tenant: Awaited<ReturnType<typeof getTenantDbQuery>> }
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
    const tenant = await getTenantDbQuery({ tenantId });
    return {
      success: true,
      data: { tenant },
    };
  } catch (error) {
    return handleServerError({
      error,
      message: "Failed to get tenant",
      user: session.user,
    });
  }
};
