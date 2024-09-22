import React from "react";

import { Badge } from "../badge";
import { Stakeholder, StakeholderType } from "./stakeholder.types";
import { formatStakeholderType } from "@/lib/formatters/stakeholder-type.formatter";

type StakeholderBadgeProps = {
  stakeholder: Stakeholder;
  onDelete?: (stakeholderId: string) => void;
};

export const StakeholderBadge: React.FC<StakeholderBadgeProps> = ({
  stakeholder,
  onDelete,
}) => {
  const {
    stakeholderId,
    type,
    company: { fullLegalName, employees },
  } = stakeholder;

  const pc = employees.find((e) => e.primaryContact);

  const variantType = (s: StakeholderType) => {
    switch (s) {
      case StakeholderType.OPERATOR:
        return "accent";
      case StakeholderType.AUDIT_LEAD:
        return "secondary";
      case StakeholderType.SERVICE_PROVIDER:
        return "primary";
      default:
        return "grey";
    }
  };

  return (
    <Badge
      onDelete={!!onDelete ? () => onDelete(stakeholderId) : undefined}
      label={formatStakeholderType(type)}
      variant={variantType(type)}
    >
      <div className="w-1 h-full bg-secondary-500"></div>
      <div className="">
        <div className="font-bold">{fullLegalName}</div>
        {!!pc && (
          <div className="text-sm">{`Contact: ${pc.personalProfile.firstName} ${pc.personalProfile.lastName}`}</div>
        )}
      </div>
    </Badge>
  );
};
StakeholderBadge.displayName = "Badge";
