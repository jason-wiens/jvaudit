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

const baseScopeSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, {
      message: "Please provide a short scope description",
    })
    .max(255, {
      message:
        "The scope description is too long. It must be less than 255 charaters",
    }),
  budget: z
    .number({
      message: "Please provide a budget for the scope",
    })
    .int({
      message: "The budget hours must be a whole number (integer)",
    }),
  type: scopeTypeEnum,
});

export const createScopeSchema = baseScopeSchema.extend({
  description: z.string().optional(),
  auditId: z.string().regex(uuidRegex, { message: "Invalid audit ID" }),
});

export const updateScopeSchema = baseScopeSchema.partial();

export type AddScopeFormInputs = z.infer<typeof createScopeSchema>;

export type UpdateScopeFormInputs = Partial<z.infer<typeof updateScopeSchema>>;
