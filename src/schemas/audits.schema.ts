import { uuidRegex } from "@/lib/utils";
import { z } from "zod";

const auditStatusEnum = z.enum([
  "CREATED",
  "CONFIRMED",
  "FIELDWORK",
  "REPORTING",
  "SUBMITTED",
  "RESPONSE",
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
  .partial()
  .extend({
    status: auditStatusEnum.optional(),
    fieldworkStartDate: z
      .date()
      .refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date > today;
        },
        {
          message: "Fieldwork start date must be later than today's date",
        }
      )
      .optional(),
    fieldworkEndDate: z.date().optional(),
    totalBudgetHours: z.number().int().positive().optional(),
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // if the fieldwork end date is in the past, it's invalid
      if (!!data.fieldworkEndDate && data.fieldworkEndDate < today)
        return false;

      // fieldwork dates are optional, so we only need to validate if one or both are present
      if (!data.fieldworkStartDate && !data.fieldworkEndDate) {
        return true;
      }

      // if both are present, the end date must be later than the start date
      if (!!data.fieldworkStartDate && !!data.fieldworkEndDate) {
        return data.fieldworkStartDate < data.fieldworkEndDate;
      }

      // if only one is present, we don't need to validate
      return false;
    },
    {
      message:
        "Fieldwork end date must be later than the start date and sometime in the future",
      path: ["fieldworkEndDate"], // Specify the path to the field
    }
  );

export type AddAuditFormInputs = z.infer<typeof createAuditSchema>;

export type UpdateAuditFormInputs = Partial<z.infer<typeof updateAuditSchema>>;
