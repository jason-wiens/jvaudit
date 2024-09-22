"use client";

import React, { FC } from "react";

import { useCompany } from "@/state";

import { EditableField } from "@/components/editable-field";
import {
  UpdateCompanyFormInputs,
  updateCompanySchema,
} from "@/schemas/company.schema";
import { serializeZodError } from "@/lib/utils";

const EditCompanyForm: FC = () => {
  const { company, updateCompany } = useCompany();

  if (!company) {
    return null;
  }

  const { fullLegalName, shortName, address } = company;

  const handleSubmit = async (inputs: UpdateCompanyFormInputs) => {
    // validate inputs
    const validatedInputs = updateCompanySchema.safeParse(inputs);
    if (!validatedInputs.success) {
      return {
        validationError: serializeZodError(validatedInputs.error)[0].message,
      };
    }

    updateCompany({
      companyId: company.companyId,
      companyData: validatedInputs.data,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <EditableField
        name="Full Legal Name"
        currentValue={fullLegalName}
        handleSubmit={(fullLegalName: string) =>
          handleSubmit({ fullLegalName })
        }
      >
        <span className="font-bold">Full Legal Name:</span>
      </EditableField>
      <EditableField
        name="Short Name"
        currentValue={shortName}
        handleSubmit={(shortName: string) => handleSubmit({ shortName })}
      >
        <span className="font-bold">Short Name:</span>
      </EditableField>
      <EditableField
        name="Address"
        currentValue={address || ""}
        handleSubmit={(address: string) => handleSubmit({ address })}
      >
        <span className="font-semibold">Address:</span>
      </EditableField>
    </div>
  );
};

export default EditCompanyForm;
