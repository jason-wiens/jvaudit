"use client";

import { createContext } from "react";

import { addAudit } from "./actions/add-audit";

import type { IAuditContext, Audit } from "./types";

export const AuditsContext = createContext<IAuditContext | null>(null);

type AuditsContextProviderProps = {
  children: React.ReactNode;
  audits: Audit[];
};

export const AuditsContextProvider = ({
  children,
  audits,
}: AuditsContextProviderProps) => {
  return (
    <AuditsContext.Provider value={{ audits, addAudit }}>
      {children}
    </AuditsContext.Provider>
  );
};
