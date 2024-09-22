import { useContext } from "react";
import { WorkspacesContext } from "./provider";

export const useWorkspaces = () => {
  const context = useContext(WorkspacesContext);

  if (!context) {
    throw new Error(
      "useWorkspaces must be used within a WorkspacesContextProvider"
    );
  }

  return context;
};
