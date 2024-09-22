import { useContext } from "react";
import { WorkspaceContext } from "./provider";

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspace must be used within a WorkspaceContextProvider"
    );
  }

  return context;
};
