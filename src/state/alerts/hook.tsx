import { useContext } from "react";
import { AlertContext } from "./provider";

export function useAlerts() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlerts must be used within a AlertContextProvider");
  }

  return context;
}
