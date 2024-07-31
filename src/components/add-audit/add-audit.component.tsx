import { FC, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AddAuditForm } from "@/components/forms/audits";

type AddAuditProps = {
  children: React.ReactNode;
};

const AddAudit: FC<AddAuditProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Audit</DialogTitle>
          <DialogDescription>
            Please fill out the form and click Add
          </DialogDescription>
          <DialogClose />
        </DialogHeader>
        <AddAuditForm
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddAudit;
