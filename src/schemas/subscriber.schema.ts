import { z } from "zod";

export const subscriberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(255, { message: "Name must be at most 255 characters." }),
  email: z.string().trim().email({ message: "Invalid email address." }),
  company: z
    .string()
    .trim()
    .max(255, { message: "Company must be at most 255 characters." }),
  comments: z
    .string()
    .trim()
    .max(1024, { message: "Comments must be at most 1024 characters." }),
});

export type SubscriberFormInputs = z.infer<typeof subscriberSchema>;
