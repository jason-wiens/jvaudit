export type Alert = {
  id: string;
  type: "success" | "warning" | "error";
  title?: string;
  message: string;
};

export type IAlertContext = {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, "id">) => void;
  removeAlert: (id: string) => void;
};
