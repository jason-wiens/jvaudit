"use server";

import { handleServerError } from "@/lib/handle-server-errors";
import { logError } from "@/lib/logging";
import { checkAdmin } from "@/permissions";
import { ServerActionResponse } from "@/types/types";
import prisma from "@lib/db";

type GetUsersDbQueryInput = {
  tenantId: string;
};

export const getUsersDbQuery = async ({ tenantId }: GetUsersDbQueryInput) =>
  await prisma.user.findMany({
    where: {
      tenantId,
    },
    select: {
      userId: true,
      avatarUrl: true,
      admin: true,
      username: true,
      createdAt: true,
      active: true,
      activeDate: true,
      forcePasswordChange: true,
      profile: {
        select: {
          position: true,
          personalProfile: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });

export const getUsers = async (): Promise<
  ServerActionResponse<
    {},
    { users: Awaited<ReturnType<typeof getUsersDbQuery>> }
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
    const users = await getUsersDbQuery({ tenantId });
    return {
      success: true,
      data: { users },
    };
  } catch (error) {
    return handleServerError({
      error,
      message: "Failed to get users",
      user: session.user,
    });
  }
};
