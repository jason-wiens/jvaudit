"use server";

import { LoginFormInputs, loginSchema } from "@/schemas/login.schema";
import type { ServerActionResponse } from "@/types/types";
import { serializeZodError } from "@/lib/utils";
import { signIn } from "../next-auth.config";
import { AuthError } from "next-auth";
import { AppRoutes } from "@/lib/routes.app";
import prisma from "@/lib/db";

export async function login(
  inputs: LoginFormInputs
): Promise<ServerActionResponse<LoginFormInputs>> {
  const validatedInputs = loginSchema.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }
  const { username, password } = validatedInputs.data;
  try {
    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            success: false,
            formErrors: [
              {
                field: "username",
                message: "Invalid username or password",
              },
            ],
          };
        }
        default: {
          return {
            success: false,
            formErrors: [
              {
                field: "username",
                message: "Invalid username or password",
              },
            ],
          };
        }
      }
    }
    throw error; // rethrow for next-auth redirect
  }
}
