import { z } from "zod";
import { uuidRegex } from "@/lib/utils";

const baseIrMessageSchema = z.object({
  body: z.string().trim().min(1, { message: "A full legal name is required" }),
});

export const createIrMessageSchema = baseIrMessageSchema.extend({
  irId: z.string().regex(uuidRegex, { message: "Invalid IR ID" }),
});

export const updateIrMessageSchema = baseIrMessageSchema;

export type AddIrMessageFormInputs = z.infer<typeof createIrMessageSchema>;

export type UpdateIrMessageFormInputs = z.infer<typeof updateIrMessageSchema>;
