"use client";

import { createContext } from "react";
import { addCompany, deleteCompany } from "./actions";

import { ICompaniesContext, Company } from "./types";

export const CompaniesContext = createContext<ICompaniesContext | null>(null);

export type CompaniesContextProviderProps = {
  children: React.ReactNode;
  companies: Company[];
};

export function CompaniesContextProvider({
  children,
  companies,
}: CompaniesContextProviderProps) {
  return (
    <CompaniesContext.Provider
      value={{
        companies,
        addCompany,
        deleteCompany,
      }}
    >
      {children}
    </CompaniesContext.Provider>
  );
}
