import { useContext } from "react";
import { CompaniesContext } from "./provider";

export const useCompanies = () => {
  const context = useContext(CompaniesContext);

  if (!context) {
    throw new Error(
      "useCompanies must be used within a CompaniesContextProvider"
    );
  }

  return context;
};
