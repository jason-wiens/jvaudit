import React, { FC } from "react";

import { useFormAsync } from "@/hooks";
import {
  UpdateWorkspaceFormInputs,
  updateWorkspaceSchema,
} from "@/schemas/workspace.schema";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ReloadIcon } from "@radix-ui/react-icons";
import { Workspace } from "@/state/workspaces/types";
import { useWorkspaces } from "@/state";

type UpdateWorkspaceFormProps = {
  workspace: Workspace;
  onSuccess: () => void;
  onCancel: () => void;
};

const UpdateWorkspaceForm: FC<UpdateWorkspaceFormProps> = ({
  onSuccess,
  workspace,
  onCancel,
}) => {
  const { updateWorkspace } = useWorkspaces();
  const { handleSubmit, register, errors, reset, pending } =
    useFormAsync<UpdateWorkspaceFormInputs>({
      schema: updateWorkspaceSchema,
      action: async (inputs) => {
        return await updateWorkspace({
          workspaceId: workspace.workspaceId,
          workspaceData: inputs,
        });
      },
      onSuccess,
      defaultValues: workspace
        ? {
            name: workspace.name,
          }
        : undefined,
    });
  return (
    <form
      action={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit();
        }
      }}
      className="flex flex-col gap-2"
    >
      <div className="space-y-1">
        <Label htmlFor="name" className="">
          Name
        </Label>
        <Input id="name" {...register("name")} disabled={pending} />
        {errors.name && (
          <div className="text-red-500">{errors.name.message}</div>
        )}
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            reset();
            onCancel();
          }}
          disabled={pending}
        >
          Cancel
        </Button>
        <Button type="submit" variant="add" size="sm">
          {pending ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              <span className="">Updating...</span>
            </>
          ) : (
            "Update Workspace"
          )}
        </Button>
      </div>
    </form>
  );
};

export default UpdateWorkspaceForm;
