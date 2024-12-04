"use client";
import { FC } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef, DataTable } from "@/components/data-table";
import { Ellipsis, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaces } from "@/state";
import { Workspace } from "@/state/workspaces/types";
import { AddWorkspace } from "@/components/add-workspace";
import { beautifyEnumTerm } from "@/lib/beautify-enums";
import { WorkspaceDropDownMenu } from "../drop-down-menus";

export const workspacesTableColumns: ColumnDef<Workspace>[] = [
  {
    id: "workspaceId",
    label: "Workspace ID",
    renderCell: ({ workspaceId }) => <>{workspaceId}</>,
    sortableValue: ({ workspaceId }) => workspaceId,
    searchableValue: ({ workspaceId }) => workspaceId,
    skeleton: () => <Skeleton className="w-[120px] h-6 rounded" />,
    renderFooter: () => (
      <div className="py-2">
        <AddWorkspace>
          <Button variant="ghost" size="sm">
            <Plus size={16} className="mr-2" />
            Add Workspace
          </Button>
        </AddWorkspace>
      </div>
    ),
  },
  {
    id: "type",
    label: "Type",
    renderCell: ({ type }) => <div className="">{beautifyEnumTerm(type)}</div>,
    sortableValue: ({ type }) => type,
    searchableValue: ({ type }) => type,
    skeleton: () => <Skeleton className="w-[80px] h-6 rounded-full" />,
  },
  {
    id: "name",
    label: "Name",
    renderCell: ({ name }) => <>{name}</>,
    sortableValue: ({ name }) => name,
    searchableValue: ({ name }) => name,
    skeleton: () => <Skeleton className="w-[120px] h-6 rounded" />,
  },
  {
    id: "defaultWorkspace",
    label: "Account Default",
    align: "center",
    renderCell: ({ tenantDefault }) =>
      tenantDefault ? (
        <div className="w-full flex justify-center">
          <Badge variant="green">Default</Badge>
        </div>
      ) : null,
  },
  {
    id: "activeAudits",
    label: "Active Audits",
    align: "center",
    renderCell: () => (
      <div className="flex items-center justify-center">{12}</div>
    ),
    sortableValue: () => 12,
    skeleton: () => <Skeleton className="w-[120px] h-6 rounded" />,
  },
  {
    id: "edit",
    label: "",
    align: "center",
    renderCell: (workspace) => <WorkspaceDropDownMenu workspace={workspace} />,
    skeleton: () => <Ellipsis />,
  },
];

export const WorkspacesTable: FC = () => {
  const { workspaces } = useWorkspaces();

  return (
    <>
      <DataTable
        columns={workspacesTableColumns}
        data={workspaces}
        searchable={true}
        rowIdKey="workspaceId"
      />
    </>
  );
};
