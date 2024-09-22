import { z } from "zod";
import { uuidRegex } from "@/lib/utils";

const resourceTypeEnum = z.enum([
  "AUDITOR",
  "AUDIT_CONTACT_OPERATOR",
  "AUDIT_CONTACT_NON_OPERATOR",
  "MANAGER",
  "OBSERVER",
]);

export const createResourceSchema = z.object({
  auditId: z.string().regex(uuidRegex, { message: "Invalid audit ID" }),
  employeeId: z.string().regex(uuidRegex, { message: "Invalid employee ID" }),
  type: resourceTypeEnum,
});

export const updateResourceSchema = z.object({
  budgetHours: z.number().int().positive().optional(),
  description: z
    .string()
    .trim()
    .max(255, {
      message:
        "The scope description is too long. It must be less than 255 charaters",
    })
    .optional(),
});

export type AddResourceFormInputs = z.infer<typeof createResourceSchema>;

export type UpdateResourceFormInputs = Partial<
  z.infer<typeof updateResourceSchema>
>;
