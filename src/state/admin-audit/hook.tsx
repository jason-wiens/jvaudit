import { useContext } from "react";
import { AdminAuditContext } from "./provider";

export const useAdminAudit = () => {
  const context = useContext(AdminAuditContext);

  if (!context) {
    throw new Error(
      "useAdminAudit must be used within a AdminAuditContextProvider"
    );
  }

  return context;
};
