"use server";

import prisma from "@lib/db";
import {
  changePasswordSchema,
  ChangePasswordFormInputs,
} from "@/schemas/login.schema";
import type { ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { serializeZodError } from "@/lib/utils";
import { logError, logAction } from "@/lib/logging";
import bcrypt from "bcryptjs";
import { AppRoutes } from "@/lib/routes.app";
import { auth, signIn } from "@/state/auth/next-auth.config";
import { AuthError } from "next-auth";
import { handleServerError } from "@/lib/handle-server-errors";

export async function changePassword(
  inputs: ChangePasswordFormInputs
): Promise<ServerActionResponse<ChangePasswordFormInputs>> {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  const tenantId = session.user.tenantId;
  const userId = session.user.userId;

  // validate inputs
  const schema = changePasswordSchema;
  const validatedInputs = schema.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }
  const { currentPassword, newPassword, confirmPassword } =
    validatedInputs.data;

  try {
    // check if user exists
    const user = await prisma.user.findUnique({
      where: {
        userId,
        tenantId,
      },
    });
    if (!user) throw new Error("User not found");

    // check if password is correct
    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordsMatch) {
      return {
        success: false,
        formErrors: [
          { field: "currentPassword", message: "Incorrect password" },
        ],
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        formErrors: [
          { field: "confirmPassword", message: "Passwords do not match" },
        ],
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        userId,
        tenantId,
      },
      data: {
        password: hashedPassword,
        forcePasswordChange: false,
      },
    });

    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "update",
      message: `User "${user.username}" changed password succesfully`,
    });

    await signIn("credentials", {
      username: user.username,
      password: newPassword,
      redirect: false,
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Unable to sign in after changing password",
      };
    }
    return handleServerError({
      error,
      message: "Failed to change password",
      user: session.user,
    });
  }
}
