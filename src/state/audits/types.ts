import { ServerActionResponse } from "@/types/types";
import { getAuditDbQuery } from "./actions/get-audits";
import { AddAuditFormInputs } from "@/schemas/audits.schema";
import { Workspace } from "@prisma/client";

export type Audit = Awaited<ReturnType<typeof getAuditDbQuery>>[0];

export type IAuditContext = {
  audits: Audit[];
  addAudit: (inputs: {
    workspaceId: Workspace["workspaceId"];
    auditData: AddAuditFormInputs;
  }) => Promise<ServerActionResponse<AddAuditFormInputs>>;
};
