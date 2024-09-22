"use client";
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

import { AddInformationRequestForm } from "@/components/forms/audits";
import { Audit } from "@prisma/client";

type AddInformationRequestProps = {
  children: React.ReactNode;
  auditId: Audit["auditId"];
};

const AddInformationRequest: FC<AddInformationRequestProps> = ({
  children,
  auditId,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Information Request</DialogTitle>
          <DialogDescription>
            Please fill out the form and click Add
          </DialogDescription>
          <DialogClose />
        </DialogHeader>
        <AddInformationRequestForm
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
          auditId={auditId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddInformationRequest;
