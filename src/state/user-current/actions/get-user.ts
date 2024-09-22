"use server";

import { logError } from "@/lib/logging";
import { checkAuthorized } from "@/permissions";
import { ServerActionResponse } from "@/types/types";
import prisma from "@lib/db";

type GetUserDbQueryInput = {
  userId: string;
  tenantId: string;
};

export const getUserDbQuery = async ({
  userId,
  tenantId,
}: GetUserDbQueryInput) =>
  await prisma.user.findUnique({
    where: {
      userId,
      tenantId,
    },
    include: {
      profile: {
        include: {
          personalProfile: true,
          employerProfile: true,
        },
      },
    },
  });

export const getUser = async (): Promise<
  ServerActionResponse<{}, { user: Awaited<ReturnType<typeof getUserDbQuery>> }>
> => {
  const session = await checkAuthorized();
  const userId = session.user.userId;
  const tenantId = session.user.tenantId;

  try {
    const user = await getUserDbQuery({ tenantId, userId });
    return {
      success: true,
      data: { user },
    };
  } catch (error) {
    const message = "Database Error: Unable to to get user.";
    logError({
      timestamp: new Date(),
      user: session.user,
      message,
      error,
    });
    return {
      success: false,
      message,
    };
  }
};
