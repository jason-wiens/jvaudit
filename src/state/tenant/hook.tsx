import { useContext } from "react";
import { TenantContext } from "./provider";

export const useTenant = () => {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error("useTenant must be used within a TenantContextProvider");
  }

  return context;
};
