"use client";

import React, { FC, useState, useEffect } from "react";

import { useAuditsContext } from "@/hooks/context.hook";
import { useAlerts } from "@/state/alerts.state";

import { EditableField, EditableFieldError } from "@/components/editable-field";
import {
  UpdateAuditFormInputs,
  updateAuditSchema,
} from "@/schemas/audits.schema";
import { serializeZodError } from "@/lib/utils";

type UpdateAuditFormProps = {
  auditId: string;
};

const UpdateAuditForm: FC<UpdateAuditFormProps> = ({ auditId }) => {
  const { audits, updateAudit } = useAuditsContext();
  const [audit, setAudit] = useState<Audit | null>(null);

  useEffect(() => {
    setAudit(audits.find((a) => a.id === auditId) || null);
  }, [auditId, audits]);

  if (!audit) {
    return null;
  }

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

    // update company
    try {
      const res = await updateAudit({
        auditId,
        auditData: validatedInputs.data,
      });
      if (res && !res.success) {
        if (res.formErrors) {
          return {
            validationError: res.formErrors[0].message,
          };
        }
      }
    } catch (error) {
      return {
        errorMsg: "An error occurred while updating the company",
      };
    }
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
