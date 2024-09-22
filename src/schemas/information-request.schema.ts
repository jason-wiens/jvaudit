import { uuidRegex } from "@/lib/utils";
import { z } from "zod";

const baseInformationRequestSchema = z.object({
  costCenterAFE: z
    .string()
    .trim()
    .min(1, { message: "Please provide a CC or AFE number" })
    .max(255, { message: "Too Long. Maximum characters allowed is 255" }),
  property: z
    .string()
    .trim()
    .min(1, { message: "Please provide a property description" })
    .max(255, { message: "Too Long. Maximum characters allowed is 255" }),
  subject: z
    .string()
    .trim()
    .min(1, { message: "Please a subject for the IR" })
    .max(255, { message: "Too Long. Maximum characters allowed is 255" }),
  subjectDetails: z
    .string()
    .trim()
    .min(1, {
      message: "Please provide a short description concerning this IR",
    })
    .max(255, { message: "Too Long. Maximum characters allowed is 255" }),
});

export const createInformationRequestSchema =
  baseInformationRequestSchema.extend({
    auditId: z.string().regex(uuidRegex, { message: "Invalid audit ID" }),
  });

export const updateInformationRequestSchema = baseInformationRequestSchema
  .partial()
  .extend({
    number: z.number().int().positive().optional(),
    body: z.string().optional(),
    actionRequested: z.string().trim().optional(),
    grossAmount: z.number().optional(),
    netAmount: z.number().optional(),
  });

export type AddInformationRequestFormInputs = z.infer<
  typeof createInformationRequestSchema
>;

export type UpdateInformationRequestFormInputs = z.infer<
  typeof updateInformationRequestSchema
>;
