import { z } from "zod";
import { uuidRegex } from "@/lib/utils";

const baseStakeholderSchema = z.object({
  type: z.enum([
    "OPERATOR",
    "AUDIT_LEAD",
    "AUDIT_PARTICIPANT",
    "NON_OP_OWNER",
    "SERVICE_PROVIDER",
  ]),
});

export const createStakeholderSchema = baseStakeholderSchema.extend({
  companyId: z.string().regex(uuidRegex, { message: "Invalid comapny ID" }),
  auditId: z.string().regex(uuidRegex, { message: "Invalid audit ID" }),
});

export const updateStakeholderSchema = baseStakeholderSchema;

export type AddStakeholderFormInputs = z.infer<typeof createStakeholderSchema>;

export type UpdateStakeholderFormInputs = Partial<
  z.infer<typeof updateStakeholderSchema>
>;
