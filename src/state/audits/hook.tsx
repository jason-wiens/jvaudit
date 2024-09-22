import { useContext } from "react";
import { AuditsContext } from "./provider";

export const useAdminAudits = () => {
  const context = useContext(AuditsContext);

  if (!context) {
    throw new Error("useAudits must be used within a AuditsContextProvider");
  }

  return context;
};