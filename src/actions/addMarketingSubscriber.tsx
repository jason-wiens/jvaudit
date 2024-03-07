"use server";

import prisma from "@lib/db";
import {
  subscriberSchema,
  SubscriberFormInputs,
} from "@schemas/subscriber.schema";
import { serializeZodError } from "@/lib/utils";
import type { ServerActionResponse } from "@/types/types";

export async function addSubscriber(
  inputs: SubscriberFormInputs
): Promise<ServerActionResponse<SubscriberFormInputs>> {
  const validatedInputs = subscriberSchema.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  try {
    // check if email already exists
    const existingSubscriber = await prisma.marketingContacts.findUnique({
      where: {
        email: validatedInputs.data.email,
      },
    });

    if (existingSubscriber)
      return {
        success: false,
        formErrors: [
          {
            field: "email",
            message: "This email address is already subscribed.",
          },
        ],
      };

    await prisma.marketingContacts.create({
      data: validatedInputs.data,
    });
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    console.log(typeof error);
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
}
