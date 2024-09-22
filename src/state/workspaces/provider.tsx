"use client";

import { createContext } from "react";
import { Workspace, IWorkspacesContext } from "./types";
import { addWorkspace, updateWorkspace } from "./actions";

type WorkspaceContextProviderProps = {
  children: React.ReactNode;
  workspaces: Workspace[];
};

export const WorkspacesContext = createContext<IWorkspacesContext | null>(null);

export function WorkspacesContextProvider({
  children,
  workspaces,
}: WorkspaceContextProviderProps) {
  return (
    <WorkspacesContext.Provider
      value={{ workspaces, addWorkspace, updateWorkspace }}
    >
      {children}
    </WorkspacesContext.Provider>
  );
}
