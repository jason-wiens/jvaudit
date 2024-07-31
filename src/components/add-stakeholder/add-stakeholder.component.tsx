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
import { useStringParam } from "@/hooks/use-string-param.hook";

import { StakeholderType } from "@/types/enums";

import { SelectCompanyForm } from "@/components/forms/company";
import { useAuditsContext } from "@/hooks/context.hook";

type AddStakeholderProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  type: StakeholderType;
};

const AddStakeholder: FC<AddStakeholderProps> = ({
  children,
  title,
  description,
  type,
}) => {
  const [open, setOpen] = useState(false);
  const auditId = useStringParam("auditId");
  const { addStakeholder } = useAuditsContext();

  const onSelect = async (companyId: Company["id"]) => {
    await addStakeholder({ auditId, companyId, type });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <DialogClose />
        </DialogHeader>
        <SelectCompanyForm
          onSelect={onSelect}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddStakeholder;
