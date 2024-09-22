"use client";

import { FC, useEffect } from "react";

import { useFormAsync } from "@/hooks/use-form-async.hook";
import {
  createInformationRequestSchema,
  AddInformationRequestFormInputs,
} from "@/schemas/information-request.schema";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addInformationRequest } from "@/state/informations-requests/actions";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Audit } from "@prisma/client";

type AddInformationRequestFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
  auditId: Audit["auditId"];
};

const AddInformationRequestForm: FC<AddInformationRequestFormProps> = ({
  onCancel,
  onSuccess,
  auditId,
}) => {
  const { handleSubmit, register, errors, pending, reset } =
    useFormAsync<AddInformationRequestFormInputs>({
      schema: createInformationRequestSchema,
      action: addInformationRequest,
      onSuccess,
      defaultValues: {
        auditId,
      },
    });

  console.log({ auditId });

  useEffect(() => {
    console.log({ errors });
  }, [errors]);

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
        <Label htmlFor="costCenterAFE" className="">
          Cost Centre / AFE *
        </Label>
        <Input
          id="costCenterAFE"
          {...register("costCenterAFE")}
          disabled={pending}
        />
        {errors.costCenterAFE && (
          <div className="text-red-500">{errors.costCenterAFE.message}</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="property" className="">
          Cost Centre / AFE Description *
        </Label>
        <Input id="property" {...register("property")} disabled={pending} />
        {errors.property && (
          <div className="text-red-500">{errors.property.message}</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="subject" className="">
          Subject *
        </Label>
        <Input id="subject" {...register("subject")} disabled={pending} />
        {errors.subject && (
          <div className="text-red-500">{errors.subject.message}</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="subjectDetails" className="">
          Subject Details *
        </Label>
        <Input
          id="subjectDetails"
          {...register("subjectDetails")}
          disabled={pending}
        />
        {errors.subjectDetails && (
          <div className="text-red-500">{errors.subjectDetails.message}</div>
        )}
      </div>
      <input type="hidden" id="auditId" {...register("auditId")} />
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
            "Add Information Request"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddInformationRequestForm;
