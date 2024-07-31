import React, { FC, useState } from "react";

import { useFormOptimistic } from "@/hooks/use-form-optimistic.hook";
import {
  AddEmployeeFormInputs,
  createEmployeeSchema,
} from "@/schemas/employee.schema";
import {
  AddPersonFormInputs,
  createPersonSchema,
} from "@/schemas/person.schema";
import { useCompanyContext } from "@/hooks/context.hook";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStringParam } from "@/hooks/use-string-param.hook";

type UpdateEmployeeFormProps = {
  employee: CompanyEmployee | null;
  onSuccess: () => void;
  onCancel: () => void;
};

const UpdateEmployeeForm: FC<UpdateEmployeeFormProps> = ({
  onSuccess,
  employee,
  onCancel,
}) => {
  const companyId = useStringParam("companyId");
  const { updateEmployee } = useCompanyContext();
  const { handleSubmit, register, errors, reset } = useFormOptimistic<
    AddEmployeeFormInputs & AddPersonFormInputs
  >({
    schema: createEmployeeSchema.merge(createPersonSchema),
    action: async (inputs) => {
      if (!employee) return;
      return await updateEmployee({
        companyId,
        employeeId: employee?.id,
        employeeData: inputs,
      });
    },
    onSubmit: onSuccess,
    defaultValues: employee
      ? {
          firstName: employee?.personalProfile.firstName || "",
          lastName: employee.personalProfile.lastName,
          email: employee.personalProfile.email,
          position: employee.position,
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
        <Label htmlFor="firstName" className="">
          First Name*
        </Label>
        <Input id="firstName" {...register("firstName")} />
        {errors.firstName && (
          <div className="text-red-500">{errors.firstName.message}</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="lastName" className="">
          Last Name*
        </Label>
        <Input id="lastName" {...register("lastName")} />
        {errors.lastName && (
          <div className="text-red-500">{errors.lastName.message}</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="email" className="">
          Email
        </Label>
        <Input id="address" {...register("email")} />
        {errors.email && (
          <div className="text-red-500">{errors.email.message}</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="position" className="">
          Position
        </Label>
        <Input id="position" {...register("position")} />
        {errors.position && (
          <div className="text-red-500">{errors.position.message}</div>
        )}
      </div>
      <p className="italic mb-8 text-sm">* Required</p>
      <div className="flex gap-2 justify-end">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            reset();
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="add" size="sm">
          Update Employee
        </Button>
      </div>
    </form>
  );
};

export default UpdateEmployeeForm;
