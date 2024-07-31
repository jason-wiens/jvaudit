import { FC, useState } from "react";

import { UpdateEmployeeForm } from "@/components/forms/employee/update-employee";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type UpdateEmployeeProps = {
  employee: CompanyEmployee | null;
  open: boolean;
  close: () => void;
};

const UpdateEmployee: FC<UpdateEmployeeProps> = ({ employee, open, close }) => {
  return (
    <Dialog open={open}>
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
          onCancel={close}
          onSuccess={close}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEmployee;
