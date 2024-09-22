"use client";

import { FC, useState } from "react";

import { useFormAsync } from "@/hooks/use-form-async.hook";

import { AddUserFormInputs, createUserSchema } from "@/schemas/user.schema";
import { addUser } from "@/state/users/actions";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { TriangleAlert, UserCheck } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AddUserProps = {
  children: React.ReactNode;
};

const AddUser: FC<AddUserProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const { handleSubmit, register, errors, pending, reset } = useFormAsync<
    AddUserFormInputs,
    { password: string }
  >({
    schema: createUserSchema,
    action: addUser,
    onSuccess: ({ password }) => setTempPassword(password),
  });

  const closeDialog = () => {
    reset();
    setOpen(false);
    setTempPassword(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          reset();
          setTempPassword(null);
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      {!!tempPassword ? (
        <DialogContent className="w-[600px]">
          <DialogClose />
          <DialogHeader>
            <DialogTitle className="text-green-500 flex items-center gap-2">
              <UserCheck /> You have successfully added a new user.
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Please provide the following temporary password to the user. They
            will be prompted to change it upon their first login.
          </DialogDescription>
          <div className="font-semibold border border-zinc-200 py-2 px-4 mb-2 rounded">
            {tempPassword}
          </div>
          <DialogDescription className="flex gap-2 items-start">
            <TriangleAlert className="text-yellow-500" />
            <p>
              <span className="font-semibold text-primary-900">
                Please copy this password now.
              </span>{" "}
              Once you close this dialog box the password will be hidden and you
              will not be able to access it anymore.
            </p>
          </DialogDescription>
          <div className="flex justify-end">
            <Button size="sm" onClick={closeDialog} variant="green">
              Done
            </Button>
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription>
              Please fill out the form and click Add
            </DialogDescription>
            <DialogClose />
          </DialogHeader>
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
            <h3 className="mb-1 font-semibold text-sm">Personal Information</h3>
            <div className="mb-4 p-4 border border-zinc-200 flex flex-col gap-2">
              <div className="space-y-1">
                <Label htmlFor="firstName" className="">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  disabled={pending}
                />
                {errors.firstName && (
                  <div className="text-red-500">{errors.firstName.message}</div>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName" className="">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  disabled={pending}
                />
                {errors.lastName && (
                  <div className="text-red-500">{errors.lastName.message}</div>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="">
                  Email *
                </Label>
                <Input id="address" {...register("email")} disabled={pending} />
                {errors.email && (
                  <div className="text-red-500">{errors.email.message}</div>
                )}
              </div>
            </div>
            <h3 className="mb-1 font-semibold text-sm">User Information</h3>
            <div className="mb-4 p-4 border border-zinc-200 flex flex-col gap-2">
              <div className="space-y-1">
                <Label htmlFor="username" className="">
                  Username *
                </Label>
                <Input
                  id="position"
                  {...register("username")}
                  disabled={pending}
                />
                {errors.username && (
                  <div className="text-red-500">{errors.username.message}</div>
                )}
              </div>
            </div>
            <h3 className="mb-1 font-semibold text-sm">Employee Information</h3>
            <div className="mb-4 p-4 border border-zinc-200 flex flex-col gap-2">
              <div className="space-y-1">
                <Label htmlFor="position" className="">
                  Position
                </Label>
                <Input
                  id="position"
                  {...register("position")}
                  disabled={pending}
                />
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
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button type="submit" variant="add" size="sm">
                {pending ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    <span className="italic">Adding...</span>
                  </>
                ) : (
                  "Add User"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AddUser;
