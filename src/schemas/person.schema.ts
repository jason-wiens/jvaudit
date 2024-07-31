import { z } from "zod";

export const basePersonSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required.")
    .max(255, "First name is too long. It must be less than 255 characters."),
  lastName: z
    .string()
    .min(1, "Last name is required.")
    .max(255, "Last name is too long. It must be less than 255 characters."),
  email: z.string().email("Invalid email address."),
});

export const createPersonSchema = basePersonSchema;

export const updatePersonSchema = basePersonSchema.partial();

export type AddPersonFormInputs = z.infer<typeof createPersonSchema>;

export type UpdatePersonFormInputs = Partial<
  z.infer<typeof updatePersonSchema>
>;
