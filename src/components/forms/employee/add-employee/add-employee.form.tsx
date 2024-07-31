import React, { FC } from "react";

import { useFormAsync } from "@/hooks/use-form-async.hook";
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
import { ReloadIcon } from "@radix-ui/react-icons";

type AddEmployeeFormProps = {
  companyId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

const AddEmployeeForm: FC<AddEmployeeFormProps> = ({
  companyId,
  onCancel,
  onSuccess,
}) => {
  const { addEmployee } = useCompanyContext();
  const { handleSubmit, register, errors, pending, reset } = useFormAsync<
    AddEmployeeFormInputs & AddPersonFormInputs
  >({
    schema: createEmployeeSchema.merge(createPersonSchema),
    action: async (inputs) => {
      return await addEmployee({ companyId, employeeData: inputs });
    },
    onSuccess,
  });
  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-2"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit();
        }
      }}
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
          Email*
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
            "Add Employee"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddEmployeeForm;
