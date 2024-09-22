"use client";

import { createContext } from "react";
import { Workspace, IWorkspaceContext } from "./types";

type WorkspaceContextProviderProps = {
  children: React.ReactNode;
  workspace: Workspace;
};

export const WorkspaceContext = createContext<IWorkspaceContext | null>(null);

export function WorkspaceContextProvider({
  children,
  workspace,
}: WorkspaceContextProviderProps) {
  return (
    <WorkspaceContext.Provider value={{ workspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
