"use client";

import { FC } from "react";

import { useFormAsync } from "@/hooks/use-form-async.hook";
import { createAuditSchema, AddAuditFormInputs } from "@/schemas/audits.schema";
import { useAudits, useWorkspace } from "@/state";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

type AddAuditFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const AddAuditForm: FC<AddAuditFormProps> = ({ onCancel, onSuccess }) => {
  const {
    workspace: { workspaceId },
  } = useWorkspace();
  const { addAudit } = useAudits();
  const { handleSubmit, register, errors, pending, reset } =
    useFormAsync<AddAuditFormInputs>({
      schema: createAuditSchema,
      action: (auditData) => addAudit({ auditData, workspaceId }),
      onSuccess,
    });

  return (
    <form
      action={handleSubmit}
      className=""
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit();
        }
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="auditNumber" className="">
          Audit Number*
        </Label>
        <Input
          id="auditNumber"
          {...register("auditNumber")}
          disabled={pending}
        />
        {errors.auditNumber && (
          <div className="text-red-500">{errors.auditNumber.message}</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="auditDescription" className="">
          Audit Description*
        </Label>
        <Input
          id="auditDescription"
          {...register("auditDescription")}
          disabled={pending}
        />
        {errors.auditDescription && (
          <div className="text-red-500">{errors.auditDescription.message}</div>
        )}
      </div>
      <p className="italic mb-8 text-sm">* Required</p>
      <div className="flex gap-2 justify-end">
        <Button
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={() => {
            reset();
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="add" size="sm">
          {pending ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              <span className="">Adding</span>
            </>
          ) : (
            "Add Audit"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddAuditForm;
