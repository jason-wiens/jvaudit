"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { generateRandomId } from "@lib/utils";

import { Alert } from "@/types/types";

interface AlertState {
  alerts: Alert[];
}

interface AlertActions {
  addAlert: (alert: Omit<Alert, "id">) => void;
  removeAlert: (id: string) => void;
}

export const useAlerts = create<AlertState & AlertActions>()(
  devtools(
    persist(
      (set) => ({
        alerts: [],
        addAlert: (alert) => {
          const id = generateRandomId();
          set((s) => ({
            ...s,
            alerts: [
              ...s.alerts,
              {
                ...alert,
                id,
              },
            ],
          }));
          setTimeout(() => {
            set((s) => ({
              ...s,
              alerts: s.alerts.filter((alert) => alert.id !== id),
            }));
          }, 5000);
        },
        removeAlert: (id) => {
          set((s) => ({
            ...s,
            alerts: s.alerts.filter((alert) => alert.id !== id),
          }));
        },
      }),
      {
        name: "jvaudit_alerts",
      }
    )
  )
);
