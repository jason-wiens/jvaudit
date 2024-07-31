import { z } from "zod";

const baseCompanySchema = z.object({
  fullLegalName: z
    .string()
    .trim()
    .min(1, { message: "A full legal name is required" })
    .max(255, { message: "Full legal name is too long" }),
  shortName: z
    .string()
    .trim()
    .min(1, {
      message: "Please provide an alias (short name) for this company",
    })
    .max(255, { message: "Short name is too long" }),
  address: z.string().trim().min(1, { message: "Address is required" }),
});

export const createCompanySchema = baseCompanySchema.extend({
  address: z.string().optional(),
});

export const updateCompanySchema = baseCompanySchema.partial();

export type AddCompanyFormInputs = z.infer<typeof createCompanySchema>;

export type UpdateCompanyFormInputs = Partial<
  z.infer<typeof updateCompanySchema>
>;
