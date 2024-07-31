import { useContext } from "react";
import { CompanyContext } from "@/contexts/companies/company-context.provider";
import { AuditsContext } from "@/contexts/audits/audits-context.provider";

export function useCompanyContext() {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error(
      "useCompanyContext must be used within a CompanyContextProvider"
    );
  }

  return context;
}

export function useAuditsContext() {
  const context = useContext(AuditsContext);

  if (!context) {
    throw new Error(
      "useContextContext must be used within a AuditContextProvider"
    );
  }

  return context;
}
