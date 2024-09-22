import { z } from "zod";
import { uuidRegex } from "@/lib/utils";

const scopeTypeEnum = z.enum([
  "CAPITAL_EXPENDITURES",
  "OPERATING_EXPENSES",
  "PRODUCTION_ALLOCATIONS",
  "EQUALIZATIONS",
  "FEES",
  "FEE_INCOME",
  "MARKETING",
  "MANAGEMENT",
  "ADMINISTRATION",
]);

export const createScopeSchema = z.object({
  type: scopeTypeEnum,
  auditId: z.string().regex(uuidRegex, { message: "Invalid audit ID" }),
});

export const updateScopeSchema = z
  .object({
    description: z
      .string()
      .trim()
      .max(255, {
        message:
          "The scope description is too long. It must be less than 255 charaters",
      })
      .optional(),
    budgetHours: z
      .number({
        message:
          "The budget hours must be a whole number (integer) greater than zero.",
      })
      .int({
        message:
          "The budget hours must be a whole number (integer) greater than zero.",
      })
      .optional(),
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
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // fieldwork dates are optional, so we only need to validate if one or both are present
      if (!data.fieldworkStartDate && !data.fieldworkEndDate) {
        return true;
      }

      // if the fieldwork end date is in the past, it's invalid
      if (!!data.fieldworkEndDate && data.fieldworkEndDate < today)
        return false;

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

export type AddScopeFormInputs = z.infer<typeof createScopeSchema>;

export type UpdateScopeFormInputs = Partial<z.infer<typeof updateScopeSchema>>;
