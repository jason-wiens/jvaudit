"use client";

import React, { FC, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Ellipsis,
  UserCog,
  Settings,
  ArrowBigUpDash,
  Trash,
} from "lucide-react";
import { useWorkspaces } from "@/state";
import { Workspace } from "@/state/workspaces/types";
import { UpdateWorkspaceForm } from "@/components/forms/workspaces";

type WorkspaceDropDownMenuProps = {
  workspace: Workspace;
};

const WorkspaceDropDownMenu: FC<WorkspaceDropDownMenuProps> = ({
  workspace,
}) => {
  const [open, setOpen] = useState(false);
  const { updateWorkspace } = useWorkspaces();

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Ellipsis className="text-zinc-500 hover:text-zinc-950 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex items-center gap-2">
            <UserCog size={12} strokeWidth={3} />
            {workspace.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem className="gap-2">
              <Settings size={12} strokeWidth={2} />
              Edit Workspace
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            className="gap-2"
            onClick={() => console.log("Change Default")}
          >
            <ArrowBigUpDash size={12} strokeWidth={2} />
            Make Default
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-red-500 hover:text-red-500 cursor-pointer"
            onClick={() => console.log("Delete Workspace")}
          >
            <Trash size={12} strokeWidth={2} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
          <DialogDescription>
            Please fill out the form and click Update
          </DialogDescription>
          <DialogClose />
        </DialogHeader>
        <UpdateWorkspaceForm
          workspace={workspace}
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceDropDownMenu;
