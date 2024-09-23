"use client";

import React, { FC } from "react";

import { useAudit } from "@/state";

import { EditableField, EditableFieldError } from "@/components/editable-field";
import {
  UpdateAuditFormInputs,
  updateAuditSchema,
} from "@/schemas/audits.schema";
import { serializeZodError } from "@/lib/utils";

const UpdateAuditForm: FC = () => {
  const { audit, updateAudit } = useAudit();

  if (!audit) return null;
  const { auditNumber, auditDescription } = audit;

  const handleSubmit = async (
    inputs: UpdateAuditFormInputs
  ): Promise<EditableFieldError | void> => {
    // validate inputs
    const validatedInputs = updateAuditSchema.safeParse(inputs);
    if (!validatedInputs.success) {
      return {
        validationError: serializeZodError(validatedInputs.error)[0].message,
      };
    }

    updateAudit({ auditId: audit.auditId, auditData: inputs });
  };

  return (
    <div className="flex flex-col gap-1">
      <EditableField
        name="Audit Number"
        currentValue={auditNumber}
        handleSubmit={(auditNumber: string) => handleSubmit({ auditNumber })}
      >
        <span className="font-bold">Audit Number:</span>
      </EditableField>
      <EditableField
        name="Audit Description"
        currentValue={auditDescription}
        handleSubmit={(auditDescription: string) =>
          handleSubmit({ auditDescription })
        }
      >
        <span className="font-bold">Audit Description:</span>
      </EditableField>
    </div>
  );
};

export default UpdateAuditForm;
