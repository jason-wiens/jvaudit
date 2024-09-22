"use server";

import AuditProvider from "@/state/audit/audit-context.provider";
import { useStringParam } from "@/hooks/use-string-param.hook";

import React from "react";

type AuditStateProps = {
  children: React.ReactNode;
  auditId: string;
};

const AuditState: React.FC<AuditStateProps> = async ({ children, auditId }) => {
  const audit = await getAudit(auditId);

  return <AuditProvider audit={audit}>{children}</AuditProvider>;
};

export default AuditState;
