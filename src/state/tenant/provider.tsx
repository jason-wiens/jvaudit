"use client";

import { createContext } from "react";
import { Tenant, ITenantContext } from "./types";

type TenantContextProviderProps = {
  children: React.ReactNode;
  tenant: Tenant;
};

export const TenantContext = createContext<ITenantContext | null>(null);

export function TenantContextProvider({
  children,
  tenant,
}: TenantContextProviderProps) {
  return (
    <TenantContext.Provider value={{ tenant }}>
      {children}
    </TenantContext.Provider>
  );
}
