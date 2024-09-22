import { ServerActionResponse } from "@/types/types";
import { getAudits } from "./actions/get-audits";

export type Audit = Awaited<ReturnType<typeof getAudits>>[0];

import { AddAuditFormInputs } from "@/schemas/audits.schema";

export type IAuditContext = {
  audits: Audit[];
  addAudit: (
    auditData: AddAuditFormInputs
  ) => Promise<ServerActionResponse<AddAuditFormInputs>>;
};
