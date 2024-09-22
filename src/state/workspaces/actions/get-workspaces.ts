"use server";

import prisma from "@lib/db";

type GetWorkspacesDbQueryInput = {
  tenantId: string;
};

export const getWorkspacesDbQuery = async ({
  tenantId,
}: GetWorkspacesDbQueryInput) =>
  await prisma.workspace.findMany({
    where: {
      tenantId,
    },
  });
