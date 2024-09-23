import { generateRandomId } from "@/lib/utils";
import { Session } from "next-auth/types";
import { logError } from "./logging";
import { Prisma } from "@prisma/client";
import { FailedServerActionResponse } from "@/types/types";

type HandleServerErrorInputs = {
  error: unknown;
  message: string;
  user: Session["user"];
};

export function handleServerError({
  error,
  message: genericMessage,
  user,
}: HandleServerErrorInputs): FailedServerActionResponse {
  const id = generateRandomId();

  let message =
    error instanceof Error
      ? `${genericMessage}: ${error.message}, See Error Log ID: ${id}`
      : `${genericMessage}, See Error Log ID: ${id} for more details.`;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    message = `Database Error: ${error.code}, See Error Log ID ${id} for more details.`;
  }

  logError({
    id,
    timestamp: new Date(),
    user,
    error,
    message,
  });

  return {
    success: false,
    message,
  };
}
