import { FC } from "react";

import { useFormAsync } from "@/hooks/use-form-async.hook";
import {
  createCompanySchema,
  AddCompanyFormInputs,
} from "@/schemas/company.schema";
import {
  AddEmployeeFormInputs,
  createEmployeeSchema,
} from "@/schemas/employee.schema";
import {
  AddPersonFormInputs,
  createPersonSchema,
} from "@/schemas/person.schema";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addCompany } from "@/state/companies/actions/add-company";
import { ReloadIcon } from "@radix-ui/react-icons";

type AddCompanyFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const AddCompany: FC<AddCompanyFormProps> = ({ onCancel, onSuccess }) => {
  const { handleSubmit, register, errors, pending, reset } = useFormAsync<
    AddCompanyFormInputs & AddEmployeeFormInputs & AddPersonFormInputs
  >({
    schema: createCompanySchema
      .merge(createEmployeeSchema)
      .merge(createPersonSchema),
    action: addCompany,
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
      <h3 className="mb-1 font-semibold text-sm">Company Data</h3>
      <div className="mb-4 p-4 border border-zinc-200 flex flex-col gap-2">
        <div className="space-y-1">
          <Label htmlFor="fullLegalName" className="">
            Legal Name*
          </Label>
          <Input
            id="fullLegalName"
            {...register("fullLegalName")}
            disabled={pending}
          />
          {errors.fullLegalName && (
            <div className="text-red-500">{errors.fullLegalName.message}</div>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="shortName" className="">
            Short Name (Alias)*
          </Label>
          <Input id="shortName" {...register("shortName")} disabled={pending} />
          {errors.shortName && (
            <div className="text-red-500">{errors.shortName.message}</div>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="address" className="">
            Address
          </Label>
          <Input id="address" {...register("address")} disabled={pending} />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
      </div>
      <h3 className="mb-1 font-semibold text-sm">Primary Contact</h3>
      <div className="mb-4 p-4 border border-zinc-200 flex flex-col gap-2">
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
      </div>
      <p className="italic mb-8 text-sm">* Required</p>
      <div className="flex gap-2 justify-end">
        <Button
          variant="ghost"
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
            "Add Company"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddCompany;
