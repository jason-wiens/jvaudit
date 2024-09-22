"use client";

import type { Alert, IAlertContext } from "./types";

import { useState, createContext } from "react";
import { generateRandomId } from "@/lib/utils";

export const AlertContext = createContext<IAlertContext | null>(null);

export type AlertContextProviderProps = {
  children: React.ReactNode;
};

export function AlertContextProvider({ children }: AlertContextProviderProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (alert: Omit<Alert, "id">) => {
    const id = generateRandomId();
    setAlerts((alerts) => [
      ...alerts,
      {
        ...alert,
        id,
      },
    ]);
    setTimeout(() => {
      setAlerts((alerts) => alerts.filter((alert) => alert.id !== id));
    }, 5000);
  };

  const removeAlert = (id: string) => {
    setAlerts((alerts) => alerts.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
}
