import { getWorkspaceDbQuery } from "./actions/get-workspace";

export type Workspace = NonNullable<
  Awaited<ReturnType<typeof getWorkspaceDbQuery>>
>;

export type Statistic = Workspace["statistics"][0];

export type IWorkspaceContext = {
  workspace: Workspace;
};
