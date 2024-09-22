import { getWorkspacesDbQuery } from "./actions/get-workspaces";

import {
  AddWorkspaceFormInputs,
  UpdateWorkspaceFormInputs,
} from "@/schemas/workspace.schema";
import { ServerActionResponse } from "@/types/types";

export type Workspace = NonNullable<
  Awaited<ReturnType<typeof getWorkspacesDbQuery>>[0]
>;

export type IWorkspacesContext = {
  workspaces: Workspace[];
  addWorkspace: (
    inputs: AddWorkspaceFormInputs
  ) => Promise<ServerActionResponse<AddWorkspaceFormInputs>>;
  updateWorkspace: (inputs: {
    workspaceId: Workspace["workspaceId"];
    workspaceData: UpdateWorkspaceFormInputs;
  }) => Promise<ServerActionResponse<UpdateWorkspaceFormInputs>>;
};
