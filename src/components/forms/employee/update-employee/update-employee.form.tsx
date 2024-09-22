import React, { FC, useState } from "react";

import { useFormAsync } from "@/hooks";
import {
  UpdateEmployeeFormInputs,
  updateEmployeeSchema,
} from "@/schemas/employee.schema";
import {
  UpdatePersonFormInputs,
  updatePersonSchema,
} from "@/schemas/person.schema";
import { useCompany } from "@/state";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Employee } from "@/state/company/types";
import { ReloadIcon } from "@radix-ui/react-icons";

type UpdateEmployeeFormProps = {
  employee: Employee;
  onSuccess: () => void;
  onCancel: () => void;
};

const UpdateEmployeeForm: FC<UpdateEmployeeFormProps> = ({
  onSuccess,
  employee,
  onCancel,
}) => {
  const { updateEmployee } = useCompany();
  const { handleSubmit, register, errors, reset, pending } = useFormAsync<
    UpdateEmployeeFormInputs & UpdatePersonFormInputs
  >({
    schema: updateEmployeeSchema.merge(updatePersonSchema),
    action: async (inputs) => {
      return await updateEmployee({
        employeeId: employee.employeeId,
        employeeData: inputs,
      });
    },
    onSuccess,
    defaultValues: employee
      ? {
          firstName: employee.personalProfile.firstName,
          lastName: employee.personalProfile.lastName,
          email: employee.personalProfile.email,
          position: employee.position || undefined,
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
        <Input id="firstName" {...register("firstName")} disabled={pending} />
        {errors.firstName && (
          <div className="text-red-500">{errors.firstName.message}</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="lastName" className="">
          Last Name*
        </Label>
        <Input id="lastName" {...register("lastName")} disabled={pending} />
        {errors.lastName && (
          <div className="text-red-500">{errors.lastName.message}</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="email" className="">
          Email
        </Label>
        <Input id="address" {...register("email")} disabled={pending} />
        {errors.email && (
          <div className="text-red-500">{errors.email.message}</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="position" className="">
          Position
        </Label>
        <Input id="position" {...register("position")} disabled={pending} />
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
          disabled={pending}
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
            "Add Employee"
          )}
        </Button>
      </div>
    </form>
  );
};

export default UpdateEmployeeForm;
