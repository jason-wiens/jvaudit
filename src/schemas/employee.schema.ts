import { z } from "zod";

const baseEmployeeSchema = z.object({
  position: z
    .string()
    .trim()
    .min(1, { message: "A position is required" })
    .max(255, { message: "Position length is too long" }),
  primaryContact: z.boolean().default(false),
});

export const createEmployeeSchema = baseEmployeeSchema.extend({
  position: z.string().optional(),
});

export const updateEmployeeSchema = baseEmployeeSchema.partial();

export type AddEmployeeFormInputs = z.infer<typeof createEmployeeSchema>;

export type UpdateEmployeeFormInputs = Partial<
  z.infer<typeof updateEmployeeSchema>
>;
