import { z } from "zod";
import { uuidRegex } from "@/lib/utils";

export const createStakeholderSchema = z.object({
  type: z.enum([
    "OPERATOR",
    "AUDIT_LEAD",
    "AUDIT_PARTICIPANT",
    "NON_OP_OWNER",
    "SERVICE_PROVIDER",
  ]),
  companyId: z.string().regex(uuidRegex, { message: "Invalid comapny ID" }),
  auditId: z.string().regex(uuidRegex, { message: "Invalid audit ID" }),
});

export type AddStakeholderFormInputs = z.infer<typeof createStakeholderSchema>;

// Note: You can not update a stakeholder. Just add and delete from an audit.
