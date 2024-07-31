import { z } from "zod";
import { uuidRegex } from "@/lib/utils";

const resourceTypeEnum = z.enum([
  "AUDITOR",
  "PRIMARY_CONTACT_OPERATOR",
  "PRIMARY_CONTACT_LEAD",
  "AUDIT_CONTACT_OPERATOR",
  "AUDIT_CONTACT_NON_OPERATOR",
  "MANAGER",
  "OBSERVER",
]);

const baseResourceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, {
      message: "Please provide a short resource description",
    })
    .max(255, {
      message:
        "The scope description is too long. It must be less than 255 charaters",
    }),
  type: resourceTypeEnum,
});

export const createResourceSchema = baseResourceSchema.extend({
  description: z.string().optional(),
  auiditId: z.string().regex(uuidRegex, { message: "Invalid audit ID" }),
  employeeId: z.string().regex(uuidRegex, { message: "Invalid employee ID" }),
});

export const updateResourceSchema = baseResourceSchema.partial();

export type AddResourceFormInputs = z.infer<typeof createResourceSchema>;

export type UpdateResourceFormInputs = Partial<
  z.infer<typeof updateResourceSchema>
>;
