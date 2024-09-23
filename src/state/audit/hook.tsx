import { useContext } from "react";
import { AuditContext } from "./provider";

export const useAudit = () => {
  const context = useContext(AuditContext);

  if (!context) {
    throw new Error("useAudit must be used within a AuditContextProvider");
  }

  return context;
};
