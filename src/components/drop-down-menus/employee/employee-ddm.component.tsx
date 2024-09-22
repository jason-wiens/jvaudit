"use client";

import React, { FC, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UpdateEmployeeForm } from "@/components/forms/employee/update-employee";
import {
  Ellipsis,
  UserCog,
  Settings,
  ArrowBigUpDash,
  Trash,
} from "lucide-react";
import { Employee } from "@/state/company/types";
import { useCompany } from "@/state";

type EmployeeDropDownMenuProps = {
  employee: Employee;
};

const EmployeeDropDownMenu: FC<EmployeeDropDownMenuProps> = ({ employee }) => {
  const [open, setOpen] = useState(false);
  const { changePrimaryContact, deleteEmployee } = useCompany();

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Ellipsis className="text-zinc-500 hover:text-zinc-950 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex items-center gap-2">
            <UserCog size={12} strokeWidth={3} />
            {`${employee.personalProfile.firstName} ${employee.personalProfile.lastName}`}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem className="gap-2">
              <Settings size={12} strokeWidth={2} />
              Edit Profile
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            className="gap-2"
            onClick={() => changePrimaryContact(employee)}
          >
            <ArrowBigUpDash size={12} strokeWidth={2} />
            Make Primary Contact
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-red-500 hover:text-red-500 cursor-pointer"
            onClick={() => deleteEmployee(employee.employeeId)}
          >
            <Trash size={12} strokeWidth={2} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Employee</DialogTitle>
          <DialogDescription>
            Please fill out the form and click Update
          </DialogDescription>
          <DialogClose />
        </DialogHeader>
        <UpdateEmployeeForm
          employee={employee}
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDropDownMenu;
