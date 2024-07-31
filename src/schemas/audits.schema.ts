import { z } from "zod";

const auditStatusEnum = z.enum([
  "CREATED",
  "CONFIRMED",
  "PREPERATION",
  "FIELDWORK",
  "REPORTING",
  "SUBMITTED",
  "RESOLVED",
  "CLOSED",
  "CANCELLED",
]);

const baseAuditSchema = z.object({
  auditNumber: z
    .string()
    .trim()
    .min(1, {
      message:
        "Please provide an audit number (identifier) that is between 1 and 16 characters",
    })
    .max(16, {
      message:
        "Please provide an audit number (identifier) that is between 1 and 16 characters",
    }),
  auditDescription: z
    .string()
    .trim()
    .min(1, {
      message: "Please provide a short audit description",
    })
    .max(255, {
      message:
        "The audit description is too long. It must be less than 255 charaters",
    }),
});

export const createAuditSchema = baseAuditSchema;

export const updateAuditSchema = baseAuditSchema
  .extend({
    status: auditStatusEnum,
  })
  .partial();

export type AddAuditFormInputs = z.infer<typeof createAuditSchema>;

export type UpdateAuditFormInputs = Partial<z.infer<typeof updateAuditSchema>>;
