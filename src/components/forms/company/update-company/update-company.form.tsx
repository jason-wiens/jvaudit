"use client";

import React, { FC, useState, useEffect, use } from "react";

import { useCompanyContext } from "@/hooks/context.hook";
import { useAlerts } from "@/state/alerts.state";

import { EditableField, EditableFieldError } from "@/components/editable-field";
import {
  UpdateCompanyFormInputs,
  updateCompanySchema,
} from "@/schemas/company.schema";
import { serializeZodError } from "@/lib/utils";

type EditCompanyFormProps = {
  companyId: string;
};

const EditCompanyForm: FC<EditCompanyFormProps> = ({ companyId }) => {
  const { companies, updateCompany } = useCompanyContext();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    setCompany(companies.find((company) => company.id === companyId) || null);
  }, [companies, companyId]);

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

    // update company
    try {
      const res = await updateCompany({
        companyId: companyId,
        companyData: validatedInputs.data,
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
