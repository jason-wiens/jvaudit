import { useContext } from "react";
import { CompanyContext } from "./provider";

export const useCompany = () => {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error(
      "useCompanies must be used within a CompanyContextProvider"
    );
  }

  return context;
};
