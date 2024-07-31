import { FC, useState } from "react";

import { AddEmployeeForm } from "@components/forms/employee/add-employee";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AddEmployeeProps = {
  children: React.ReactNode;
  companyId: string;
};

const AddEmployee: FC<AddEmployeeProps> = ({ children, companyId }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Please fill out the form and click Add
          </DialogDescription>
          <DialogClose />
        </DialogHeader>
        <AddEmployeeForm
          companyId={companyId}
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployee;
