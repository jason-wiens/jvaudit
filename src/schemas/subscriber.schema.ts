import { z } from "zod";

export const subscriberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, {
      message: "Please provide your name. Name must be at least 3 characters.",
    })
    .max(255, { message: "Name must be at most 255 characters." }),
  email: z.string().trim().email({ message: "Invalid email address." }),
  company: z
    .string()
    .trim()
    .min(3, {
      message:
        "Please provide a company name. Company name must be at least 3 characters.",
    })
    .max(255, { message: "Company must be at most 255 characters." }),
  comments: z
    .string()
    .trim()
    .max(1024, { message: "Comments must be at most 1024 characters." })
    .optional(),
});

export type SubscriberFormInputs = z.infer<typeof subscriberSchema>;
