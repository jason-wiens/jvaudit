"use client";

import { FC, memo, useEffect, useState, useMemo } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { User } from "@/state/users/types";
import { Pencil } from "lucide-react";
import { useUsers } from "@/state";
import { UpdateUserFormInputs, updateUserSchema } from "@/schemas/user.schema";
import { useFormOptimistic } from "@/hooks";

type EditUserProps = {
  user: User;
};

export const EditUser: FC<EditUserProps> = ({ user }) => {
  const { updateUser } = useUsers();
  const [open, setOpen] = useState<boolean>(false);
  const { handleSubmit, register, errors, reset } =
    useFormOptimistic<UpdateUserFormInputs>({
      schema: updateUserSchema,
      action: (inputs) => updateUser({ userId: user.userId, userData: inputs }),
      onSubmit: () => {
        setOpen(false);
        reset();
      },
      defaultValues: {
        firstName: user.profile.personalProfile.firstName,
        lastName: user.profile.personalProfile.lastName,
        email: user.profile.personalProfile.email,
        position: user.profile.position || "",
      },
    });

  const closeDialog = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
              <Pencil size={16} className="" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit User</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Please fill out the form and click "Edit User" to save changes.
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
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <div className="text-red-500">{errors.firstName.message}</div>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="">
                Last Name *
              </Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <div className="text-red-500">{errors.lastName.message}</div>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="">
                Email *
              </Label>
              <Input id="address" {...register("email")} />
              {errors.email && (
                <div className="text-red-500">{errors.email.message}</div>
              )}
            </div>
          </div>
          <h3 className="mb-1 font-semibold text-sm">Employee Information</h3>
          <div className="mb-4 p-4 border border-zinc-200 flex flex-col gap-2">
            <div className="space-y-1">
              <Label htmlFor="position" className="">
                Position
              </Label>
              <Input id="position" {...register("position")} />
              {errors.position && (
                <div className="text-red-500">{errors.position.message}</div>
              )}
            </div>
          </div>
          <p className="italic mb-8 text-sm">* Required</p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit" variant="add" size="sm">
              Edit User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
